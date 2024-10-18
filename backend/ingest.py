from langchain_community.document_loaders import Docx2txtLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from pinecone import Pinecone
from openai import OpenAI

client = OpenAI(api_key="")

pc = Pinecone(api_key="")
index = pc.Index("compliance")


text_splitter = RecursiveCharacterTextSplitter(
    separators=["\n\n", ". ", "? ", "! ", "\n"],
    chunk_size=1000,
    chunk_overlap=20,
)

ids = 0

docs = [
    "docs/C2024C00614VOL01.docx",
    "docs/C2024C00614VOL02.docx",
    "docs/C2024C00614VOL03.docx",
    "docs/C2024C00614VOL04.docx",
]


def clean_text(text):
    # Replace newline, tab, and carriage return characters
    cleaned_text = text.replace("\n", " ").replace("\t", " ").replace("\r", " ")
    # Optional: You can also strip extra spaces
    cleaned_text = " ".join(cleaned_text.split())
    return cleaned_text


for doc in docs:
    loader = Docx2txtLoader(doc)
    data = loader.load_and_split(text_splitter)
    print(f"Generated {len(data)} chunks from {doc}")

    for chunk in data:
        response = client.embeddings.create(
            input=clean_text(chunk.page_content.strip()), model="text-embedding-3-large"
        )

        index.upsert(
            vectors=[
                {
                    "id": str(ids),
                    "values": response.data[0].embedding,
                    "metadata": {
                        "content": chunk.page_content,
                        "source": chunk.metadata.get("source"),
                    },
                },
            ],
        )
        ids += 1
        print(f"Upserted {ids} chunks to Pinecone")
