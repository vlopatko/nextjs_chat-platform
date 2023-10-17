import { db } from '@/db'
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import { createUploadthing, type FileRouter } from 'uploadthing/next'

import { PDFLoader } from 'langchain/document_loaders/fs/pdf'
import { OpenAIEmbeddings } from 'langchain/embeddings/openai'

// import { PineconeStore } from 'langchain/vectorstores/pinecone'
// import { pinecone } from '@/lib/pinecone'

// import { Milvus } from 'langchain/vectorstores/milvus'
// import { MilvusClient } from '@zilliz/milvus2-sdk-node'

import { QdrantVectorStore } from 'langchain/vectorstores/qdrant'
import { getQdrantClient } from '@/lib/qdrant'

const f = createUploadthing()

export const ourFileRouter = {
  pdfUploader: f({ pdf: { maxFileSize: '4MB' } })
    .middleware(async ({ req }) => {
      const { getUser } = getKindeServerSession()
      const user = getUser()

      if (!user || !user.id) {
        throw new Error('Unauthorized')
      }

      return { userId: user.id }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      const createdFile = await db.file.create({
        data: {
          key: file.key,
          name: file.name,
          userId: metadata.userId,
          url: `https://uploadthing-prod.s3.us-west-2.amazonaws.com/${file.key}`,
          uploadStatus: 'PROCESSING',
        },
      })

      try {
        const response = await fetch(
          `https://uploadthing-prod.s3.us-west-2.amazonaws.com/${file.key}`
        )

        const blob = await response.blob()

        const loader = new PDFLoader(blob)

        const pageLevelDocs = await loader.load()

        const pagesAmt = pageLevelDocs.length

        //#region (vectorize and index entire document) START
        const embeddings = new OpenAIEmbeddings({
          openAIApiKey: process.env.OPENAI_API_KEY2,
        })

        const qdrantClient = getQdrantClient()

        // const collectionName = `drop-doc-${file.key}`

        // qdrantClient.createCollection(collectionName, {
        //   vectors: {
        //     size: 1536,
        //     distance: 'Cosine',
        //   },
        // })

        await QdrantVectorStore.fromDocuments(pageLevelDocs, embeddings, {
          client: qdrantClient,
          url: process.env.QDRANT_URL,
          apiKey: process.env.QDRANT_API_KEY,
          collectionName: `drop-doc-${file.key}`,
        })
        //#endregion (vectorize and index entire document) END

        await db.file.update({
          data: {
            uploadStatus: 'SUCCESS',
          },
          where: {
            id: createdFile.id,
          },
        })
      } catch (e) {
        console.log(e)
        await db.file.update({
          data: {
            uploadStatus: 'FAILED',
          },
          where: {
            id: createdFile.id,
          },
        })
      }
    }),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
