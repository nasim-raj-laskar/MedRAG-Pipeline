from langchain_community.vectorstores import FAISS
from app.components.embeddings import get_embeddings_model
from app.common.logger import get_logger
from app.common.custom_exception import CustomException
from app.config.config import DB_FAISS_PATH
import os

logger=get_logger(__name__)

def load_vector_store():
    try:
        embeddings=get_embeddings_model()
        
        if os.path.exists(DB_FAISS_PATH):
            logger.info("Loading existing vector store")

            return FAISS.load_local(
                DB_FAISS_PATH, 
                embeddings, 
                allow_dangerous_deserialization=True
                )
        else:
            logger.warning("Vector store does not exist. Creating a new one.")

    except Exception as e:
        error_message = CustomException("Failed to laod vector store", e)
        logger.error(str(error_message))
        return []

#creating
def save_vector_store(text_chunk):
    try:
        if not text_chunk:
            raise CustomException("No text chunk provided to save vector store") 
        logger.info("Generating Vector DB")
        embeddings=get_embeddings_model()
        db=FAISS.from_documents(text_chunk,embeddings)
        logger.info("Saving Vector DB")

        db.save_local(DB_FAISS_PATH)
        logger.info("Vector DB saved successfully")
        return db

    except Exception as e:
        error_message = CustomException("Failed to create new vector store", e)
        logger.error(str(error_message))
        return []