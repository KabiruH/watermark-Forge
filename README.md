# ⚒️ WatermarkForge

A powerful Next.js application for batch watermarking images with logos, text, and frames. Perfect for photographers, content creators, and anyone who needs to watermark hundreds of images quickly and consistently.

## ✨ Features

### Core Functionality
- 📁 **Batch Processing** - Watermark up to 1000+ images at once
- 🖼️ **Multiple Logo Support** - Add multiple logo images to each photo
- 📝 **Text Watermarks** - Add customizable text with multiple fonts and colors
- 🖼️ **Frames/Borders** - Create resizable frames around or within your images
- 💾 **Save Presets** - Save your watermark configurations for reuse
- 📦 **ZIP Export** - All processed images are downloaded as a single ZIP file

### Advanced Features
- 🎯 **Relative Positioning** - Logos and frames adapt to portrait/landscape images automatically
- 🎨 **Visual Editor** - Drag and drop elements to position them precisely
- 📐 **Resizable Frames** - Click and drag frame edges to resize
- 🔄 **Live Preview** - See exactly how watermarks will look before processing
- 💪 **Client-Side Processing** - All processing happens in your browser (no uploads needed)

## 🚀 Getting Started

### Prerequisites
- Node.js version **20.9.0 or higher**
- npm or yarn package manager

## 📖 How to Use

### Basic Workflow

1. **Upload Images**
   - Click "Upload Images" and select all photos you want to watermark
   - You can select 1000+ images at once

2. **Add Elements**
   - **Logos**: Upload one or more logo files
   - **Text**: Click "Add Text Watermark" to add text
   - **Frames**: Click "Add Frame/Border" to add a border

3. **Position Elements**
   - Drag logos, text, and frames on the preview canvas
   - For frames: Drag edges/corners to resize
   - Adjust size, opacity, and other properties in the control panels

4. **Choose Positioning Mode**
   - **Relative Mode** (Recommended): Elements scale proportionally across all images
   - **Absolute Mode**: Fixed pixel positions on all images

5. **Process Images**
   - Click "⚡ Process All & Download ZIP"
   - Wait for the progress bar to complete
   - Your ZIP file will download automatically

### Positioning Modes Explained

#### Relative Mode (Green - Recommended)
Perfect for batches with mixed portrait and landscape images.

**Example:**
- On a 1000px wide image, logo at 5% from left = 50px
- On a 2000px wide image, logo at 5% from left = 100px
- Logo size scales proportionally too!

**Use when:**
- You have mixed portrait/landscape images
- You want consistent margins across different image sizes
- You want logos/text to scale with image dimensions

#### Absolute Mode (Yellow)
Fixed pixel positioning - same position on all images regardless of size.

**Example:**
- Logo always at exactly 50px from left, 50px from top
- Logo is always 200px wide

**Use when:**
- All images are the same size
- You need exact pixel-perfect positioning

### Working with Frames

1. **Add a Frame**: Click "Add Frame/Border"
2. **Move**: Click inside the frame and drag
3. **Resize**: 
   - Hover near edges or corners until cursor changes
   - Drag to resize
   - **Corners**: Resize diagonally
   - **Edges**: Resize in one direction
4. **Style**: Adjust border width, color, and opacity

### Saving and Loading Presets

1. **To Save:**
   - Set up your logos, text, and frames
   - Enter a name in the "Preset name" field
   - Click "💾 Save Current Setup"

2. **To Load:**
   - Click "📂 Load Preset"
   - Select from the list of saved presets
   - Your watermark setup will be restored

Note: Presets are saved in your browser's localStorage and persist between sessions.

## 🎨 Customization Options

### Logos
- ✅ Size (width with maintained aspect ratio)
- ✅ Position (drag to move)
- ✅ Opacity (0-100%)
- ✅ Positioning mode (absolute/relative)

### Text Watermarks
- ✅ Text content
- ✅ Font family (Arial, Helvetica, Times New Roman, etc.)
- ✅ Font size (12-200px)
- ✅ Color (any color via color picker)
- ✅ Position (drag to move)
- ✅ Opacity (0-100%)
- ✅ Positioning mode (absolute/relative)

### Frames/Borders
- ✅ Width and height (resize by dragging)
- ✅ Border thickness (1-50px)
- ✅ Border color (any color via color picker)
- ✅ Position (drag to move)
- ✅ Opacity (0-100%)
- ✅ Positioning mode (absolute/relative)

## 💡 Tips & Best Practices

### For Best Results

1. **Use Relative Mode** for mixed image batches
2. **Test with one image first** - Upload a sample image, set up watermarks, process it, then do the full batch
3. **Save presets** for different use cases (e.g., "Instagram", "Website", "Client Photos")
4. **Keep logos simple** - PNG files with transparency work best
5. **Consider contrast** - Use white text on dark images, dark text on light images

### Performance Tips

- **Large batches (500+ images)**: Processing may take 1-2 minutes
- **High-resolution images**: May take longer to process
- **Close other browser tabs** to free up memory during processing

### Common Use Cases

**Photography Watermarks:**
- Small logo in corner (relative mode, 5% from edges)
- Text with copyright info at bottom
- Both with 70% opacity for subtlety

**Product Photos:**
- Large frame around entire image
- Logo centered at bottom
- Text with product info

**Social Media:**
- Small logo in consistent corner
- Text with handle/username
- Relative mode for different aspect ratios

## 🛠️ Technical Details

### Built With
- **Next.js 15** - React framework
- **React 19** - UI library
- **JSZip** - ZIP file generation
- **Canvas API** - Image processing

### Browser Compatibility
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

### Privacy
- ✅ **100% client-side processing** - Your images never leave your computer
- ✅ **No server uploads** - Everything happens in your browser
- ✅ **No tracking** - No analytics or data collection

## 🐛 Troubleshooting

### "Node.js version required" error
**Solution**: Upgrade to Node.js 20 or higher
```bash
nvm install 20
nvm use 20
```

### Logos not appearing on processed images
**Solution**: Make sure you've actually added logos (check "X logos added" counter) and positioned them on the preview before processing

### Browser crashes with many images
**Solution**: 
- Try processing in smaller batches (250-500 images at a time)
- Close other browser tabs
- Use a desktop browser (not mobile)

### Preview not updating
**Solution**: 
- Try refreshing the page
- Make sure you've uploaded images first
- Check browser console for errors

### ZIP file not downloading
**Solution**: 
- Check browser's download settings
- Allow pop-ups for localhost
- Make sure you have disk space available

## 📝 License

This project is open source and available for personal and commercial use.

## 🤝 Contributing

Feel free to fork, modify, and improve this project! Some ideas for contributions:
- Additional font options
- More frame styles (rounded corners, dashed borders)
- Rotation controls for logos
- Shadow effects
- Blur/opacity gradients

## 💬 Support

Having issues? 
1. Check the Troubleshooting section above
2. Make sure you're using Node.js 20+
3. Verify all dependencies are installed correctly

## 🎉 Credits

Built with passion for photographers and content creators who need a fast, free, and privacy-respecting way to watermark their images.

---

**WatermarkForge** - Forge your brand onto images, one batch at a time. ⚒️