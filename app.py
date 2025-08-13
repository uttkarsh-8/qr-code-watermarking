from flask import Flask, request, send_file, jsonify
from flask_cors import CORS
import os
from qr_generator import generate_qr_code
from watermark import add_watermark

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Ensure directories exist
os.makedirs('static', exist_ok=True)
os.makedirs('uploads', exist_ok=True)

@app.route('/generate', methods=['POST'])
def generate():
    try:
        # Get form data
        data = request.form.get('data')
        if not data:
            return jsonify({'error': 'No data provided'}), 400
            
        watermark = request.files.get('watermark', None)
        
        # Generate QR code
        qr_path = 'static/qr_code.png'
        generate_qr_code(data, qr_path)
        
        # Process watermark if provided
        output_path = 'static/watermarked_qr.png'
        if watermark and watermark.filename:
            # Save watermark
            watermark_path = 'uploads/watermark.png'
            watermark.save(watermark_path)
            
            # Get watermark parameters
            position = request.form.get('position', 'center')
            transparency = int(request.form.get('transparency', 128))
            scale = float(request.form.get('scale', 0.25))
            
            # Add watermark
            add_watermark(qr_path, watermark_path, output_path, position, transparency, scale)
        else:
            # If no watermark, just use the original QR code
            os.rename(qr_path, output_path)
        
        # Return the generated image
        return send_file(output_path, mimetype='image/png')
    except Exception as e:
        print(f"Error generating QR code: {str(e)}")
        return jsonify({'error': f'Failed to generate QR code: {str(e)}'}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)