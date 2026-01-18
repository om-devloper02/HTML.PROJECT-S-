# Travel & Tourism Recommendation System - Image Setup

## How to Add Images

The system expects PNG images in the `images/` folder. You need to add these 8 PNG files:

1. **manali.png** - Mountain landscape (500x300px)
2. **goa.png** - Beach sunset (500x300px)
3. **jaipur.png** - Pink city architecture (500x300px)
4. **darjeeling.png** - Tea gardens (500x300px)
5. **jaisalmer.png** - Desert fort (500x300px)
6. **kerala.png** - Backwater landscape (500x300px)
7. **shimla.png** - Snow mountains (500x300px)
8. **udaipur.png** - Palace and lakes (500x300px)

## Quick Setup Option

If you don't have images, you can:

1. Download free images from:
   - Pexels.com
   - Pixabay.com
   - Unsplash.com

2. Resize them to 500x300 pixels

3. Save as PNG format in the `images/` folder

4. Name them exactly as listed above

## Alternative: Use Online Images

If you want to use online images instead, edit `data.js` and replace:
```javascript
image: "images/manali.png"
```

With:
```javascript
image: "https://images.pexels.com/photos/3408356/pexels-photo-3408356.jpeg"
```

The system will work with both local PNG files and online image URLs.
