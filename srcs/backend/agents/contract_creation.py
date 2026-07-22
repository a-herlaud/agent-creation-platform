from litellm import completion
from pypdf import PdfReader

def contract_creation():
    response = completion(
        model="ollama/my-coder",
        messages=[
            {"role": "user", "content": "test"}
        ],
        api_base="http://localhost:11434",
        api_key="ollama"
    )
    print(response.choices)
    return response.choices[0].message.content

def get_pdf_content(path):
    reader = PdfReader(path)

    text = ""
    for page in reader.pages:
        text += page.extract_text() + "\n"
        
    return text

print(get_pdf_content("./doc/test.pdf"))
# print(contract_creation())