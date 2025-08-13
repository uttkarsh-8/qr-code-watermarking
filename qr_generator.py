import qrcode
from PIL import Image

def generate_qr_code(data, filename='qr_code.png'):
    """
    Generate a QR code from the provided data and save it as an image.
    
    Args:
        data (str): The data to encode in the QR code.
        filename (str): The filename to save the QR code image.
        
    Returns:
        Image: The generated QR code image.
    """
    # Create a QR code instance
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        box_size=10,
        border=4,
    )
    
    # Add data to the QR code
    qr.add_data(data)
    qr.make(fit=True)
    
    # Create an image from the QR code
    img = qr.make_image(fill_color="black", back_color="white")
    
    # Save the image
    img.save(filename)
    
    return img