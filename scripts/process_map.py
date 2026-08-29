from PIL import Image
import numpy as np

img = Image.open('public/tamilnadu-districts-map.png').convert('RGBA')
arr = np.array(img)

# Ocean / sea color in Wikimedia map: light blue/cyan around rgb(217, 235, 249) or rgb(215-240, 230-250, 245-255)
# Also surrounding gray outside TN: rgb(240-255, 240-255, 240-255)
r, g, b, a = arr[:, :, 0], arr[:, :, 1], arr[:, :, 2], arr[:, :, 3]

# Identify ocean blue (high blue, medium-high red/green but blue dominant and light)
is_ocean = (b > 230) & (g > 210) & (r > 190) & (b > r + 15)
# Identify neighboring gray/white background (Kerala, Karnataka, AP, outer borders if plain gray > 240)
is_gray_bg = (r > 238) & (g > 238) & (b > 238)

# Convert ocean and plain outer background to fully transparent
arr[is_ocean | is_gray_bg, 3] = 0

out = Image.fromarray(arr)
out.save('public/tamilnadu-districts-transparent.png')
print("Successfully generated transparent map!")
