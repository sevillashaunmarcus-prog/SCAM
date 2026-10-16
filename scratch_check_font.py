import urllib.request
import os

url = "https://fonts.gstatic.com/s/pixelifysans/v3/CHy3V-2EnNVvdWW7pY3AmFvWc27Zc28r_5n_.woff2"
# Let's inspect the css import in pixel-base.css:
# @import url('https://fonts.googleapis.com/css2?family=Pixelify+Sans:wght@400;600;700&family=Press+Start+2P&family=VT323&display=swap');
print("Checking Pixelify Sans ligature")
