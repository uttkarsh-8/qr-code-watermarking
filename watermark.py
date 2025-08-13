from PIL import Image

def add_watermark(qr_image_path, watermark_image_path, output_image_path, position='center', transparency=128, scale=0.25):
    """
    Add a watermark to a QR code image.
    
    Args:
        qr_image_path (str): Path to the QR code image.
        watermark_image_path (str): Path to the watermark image.
        output_image_path (str): Path to save the watermarked image.
        position (str): Position of the watermark ('center', 'top-left', 'top-right', 'bottom-left', 'bottom-right').
        transparency (int): Transparency level of the watermark (0-255).
        scale (float): Scale factor for the watermark size relative to the QR code.
        
    Returns:
        Image: The watermarked image.
    """
    # Open the QR code image
    qr_img = Image.open(qr_image_path).convert("RGBA")
    
    # Open the watermark image
    watermark_img = Image.open(watermark_image_path).convert("RGBA")
    
    # Resize the watermark based on the scale factor
    qr_width, qr_height = qr_img.size
    watermark_width, watermark_height = watermark_img.size
    
    # Calculate new size for watermark
    new_width = int(qr_width * scale)
    new_height = int(watermark_height * (new_width / watermark_width))
    
    # Resize watermark
    watermark_img = watermark_img.resize((new_width, new_height), Image.Resampling.LANCZOS)
    
    # Adjust transparency
    alpha = watermark_img.split()[-1]  # Get the alpha channel
    alpha = alpha.point(lambda p: min(p, transparency))  # Apply transparency
    watermark_img.putalpha(alpha)
    
    # Calculate position
    qr_width, qr_height = qr_img.size
    wm_width, wm_height = watermark_img.size
    
    if position == 'center':
        x = (qr_width - wm_width) // 2
        y = (qr_height - wm_height) // 2
    elif position == 'top-left':
        x = 10
        y = 10
    elif position == 'top-right':
        x = qr_width - wm_width - 10
        y = 10
    elif position == 'bottom-left':
        x = 10
        y = qr_height - wm_height - 10
    elif position == 'bottom-right':
        x = qr_width - wm_width - 10
        y = qr_height - wm_height - 10
    else:
        x = (qr_width - wm_width) // 2
        y = (qr_height - wm_height) // 2
    
    # Paste the watermark onto the QR code
    qr_img.paste(watermark_img, (x, y), watermark_img)
    
    # Convert back to RGB if needed
    qr_img = qr_img.convert("RGB")
    
    # Save the watermarked image
    qr_img.save(output_image_path)
    
    return qr_img