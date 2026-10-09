import streamlit as st
from PIL import Image
from transformers import pipeline

st.set_page_config(
    page_title="AI Plant Health Assistant",
    page_icon="🌱",
    layout="centered"
)

st.title("🌱 AI Plant Health Assistant")
st.write("Upload a plant leaf image to check its health.")

@st.cache_resource
def load_model():
    return pipeline(
        "image-classification",
        model="kimcomehome/plantvillage-vit-leaf-disease"
    )

uploaded_file = st.file_uploader(
    "Choose a plant leaf image",
    type=["jpg", "jpeg", "png"]
)

if uploaded_file is not None:
    image = Image.open(uploaded_file).convert("RGB")
   st.image(
    image,
    caption="Uploaded Plant Image",
    use_column_width=True
)

    if st.button("🔍 Analyze Plant"):
        with st.spinner("AI is analyzing your plant..."):
            try:
                classifier = load_model()
                predictions = classifier(image, top_k=3)

                st.subheader("🌿 Analysis Results")
                st.write("**Prediction:**", predictions[0]["label"])
                st.write(
                    "**Confidence:**",
                    f"{predictions[0]['score'] * 100:.2f}%"
                )

                st.write("**Top 3 predictions:**")
                for item in predictions:
                    st.write(
                        f"- {item['label']}: "
                        f"{item['score'] * 100:.2f}%"
                    )

            except Exception as e:
                st.error(f"Analysis failed: {e}")