#!/bin/zsh
cd "/Users/hankkuo/Desktop/claude-ai/作品網站/hank-intro-site"
STYLE='1960s retro cartoon print style, bold uneven black ink outline, flat muted retro colors, visible halftone dot printing texture, subtle aged paper grain and slight ink misregistration, gently faded and worn, surrounded by a thick off-white die-cut sticker border with a few small worn nicks, completely flat 2D illustration with no 3D shading and no gradients, centered, filling about 75% of the frame, pure flat green screen background #00E000, no text, no logo, square 1024x1024'

gen () {
  name=$1; subject=$2
  echo "=== $name ==="
  codex exec -s workspace-write --skip-git-repo-check "Use the imagegen skill to generate ONE image and save it to public/images/fall/$name.png in this workspace.

Prompt for the image:
\"Die-cut vintage sticker of $subject, $STYLE\"

Requirements:
- square 1024x1024, flat pure green background #00E000
- save to public/images/fall/$name.png
- do not modify any other file
Report the saved path." 2>&1 | tail -3
}

gen pen        'a fountain pen seen from the side, classic ink pen with a visible nib and a cap clip, warm cream body with dark navy accents'
gen smiley     'a round smiling face, simple circle head with two dot eyes and a wide curved smile, warm coral red fill'
gen rod        'a short simplified fishing rod handle with a curved tip, a thin fishing line and a round red-and-white float hanging below it'
gen shoe       'a chunky retro sneaker seen from the side, cream body with a dark navy sole and a single stripe'
gen fin        'a single long diving fin (swim flipper) seen from the side, teal blue with a darker foot pocket'
gen bottle     'a stout beer bottle with a small oval label, deep olive green glass with a cream label'
gen palm       'a short stubby coconut palm tree, thick curved trunk with three big fan leaves and two brown coconuts'
gen starface   'a five-pointed star, warm yellow fill'
