from langchain.llms import huggingface_hub
from app.config.config import HF_TOKEN,HUGGINGFACE_REPO_ID
from app.common.logger import get_logger
from app.common.custom_exception import CustomException

logger=get_logger(__name__)

def load_llm(hf_token:str=HF_TOKEN,huggingface_repo_id:str=HUGGINGFACE_REPO_ID):
    try:
        logger.info("Loading the LLM from huggingface")

        llm=huggingface_hub(
            repo_id=huggingface_repo_id,
            model_kwargs={
                "temperature":0.3,
                "max_length":256,
                "return_full_text":False},
           
            huggingfacehub_api_token=hf_token
        )

        logger.info("LLM loaded successfully. . .")

        return llm
    except Exception as e:
        error_message = CustomException("Failed to load LLM", e)
        logger.error(str(error_message))
        return None