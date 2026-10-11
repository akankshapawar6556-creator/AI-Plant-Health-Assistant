from optimum.onnxruntime import ORTModelForImageClassification, ORTQuantizer
from optimum.onnxruntime.configuration import AutoQuantizationConfig
from transformers import AutoImageProcessor

MODEL_ID = "kimcomehome/plantvillage-vit-leaf-disease"
ONNX_DIR = "./onnx_model"
QUANT_DIR = "./onnx_model_quantized"

print("Step 1: Exporting PyTorch model to ONNX...")
ort_model = ORTModelForImageClassification.from_pretrained(MODEL_ID, export=True)
ort_model.save_pretrained(ONNX_DIR)

processor = AutoImageProcessor.from_pretrained(MODEL_ID)
processor.save_pretrained(ONNX_DIR)
print("ONNX export done!")

print("Step 2: Quantizing to INT8...")
quantizer = ORTQuantizer.from_pretrained(ONNX_DIR)
qconfig = AutoQuantizationConfig.avx512_vnni(is_static=False, per_channel=False)
quantizer.quantize(save_dir=QUANT_DIR, quantization_config=qconfig)

print("SUCCESS! Check ./onnx_model_quantized folder")