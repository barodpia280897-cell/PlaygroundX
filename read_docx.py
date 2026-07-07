import zipfile
import xml.etree.ElementTree as ET

docx_path = r"c:\Users\91969\Desktop\kiaan priya\PLAYGROUND_CRM\PGX CENTER_new\PLAYGROUNDX CRM OPERATING SYSTEM-2.docx"
try:
    with zipfile.ZipFile(docx_path) as z:
        xml_content = z.read("word/document.xml")
    root = ET.fromstring(xml_content)
    ns = {"w": "http://schemas.openxmlformats.org/wordprocessingml/2006/main"}
    paragraphs = []
    for p in root.findall(".//w:p", ns):
        texts = [node.text for node in p.findall(".//w:t", ns) if node.text]
        if texts:
            paragraphs.append("".join(texts))
    print("\n".join(paragraphs))
except Exception as e:
    print(f"Error: {e}")
