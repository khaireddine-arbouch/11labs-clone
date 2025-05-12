#!/bin/bash

# Create submission directory
mkdir -p final_submission

# Copy frontend code (excluding node_modules)
mkdir -p final_submission/11labs-clone-frontend
rsync -av --exclude 'node_modules' --exclude '.next' --exclude '.git' 11labs-clone-frontend/ final_submission/11labs-clone-frontend/

# Copy backend code
cp -r seed-vc final_submission/
cp -r StyleTTS2 final_submission/
cp -r Make-An-Audio final_submission/

# Copy documentation
cp README.md final_submission/
cp MODEL_TRAINING.md final_submission/
cp docker-compose.yml final_submission/

# Copy LaTeX source and PDF
cp "Latex Source Code.zip" final_submission/
cp "11Labs_Clone__A_Comprehensive_AI_Voice_Generation_Platform__1_.pdf" final_submission/

# Create zip file
zip -r final_submission.zip final_submission/

echo "Submission package prepared as final_submission.zip"
echo "Please verify the contents before submitting!" 