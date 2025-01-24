from transformers import pipeline


class LLMService:
    def __init__(self, model_name="gpt2"):
        """
        Initialize LLM service with a default model
        """
        self.summarizer = pipeline("text-generation", model=model_name)

    def generate_summary(self, context, max_length=150):
        """
        Generate a summary using the LLM

        :param context: Text to be summarized
        :param max_length: Maximum length of summary
        :return: Summarized text
        """
        try:
            summary = self.summarizer(context, max_length=max_length, do_sample=True)[
                0
            ]["generated_text"]
            return summary
        except Exception as e:
            print(f"Error in LLM summarization: {e}")
            return context  # Return original text if summarization fails
