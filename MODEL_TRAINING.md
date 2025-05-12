# Model Training and Deployment Guide

This guide provides detailed instructions for fine-tuning and deploying the AI voice generation models used in this project. For a more detailed walkthrough of the entire project, please refer to the [Full Stack Voice AI Platform Guide](https://khaireddinearb.notion.site/A-Full-Stack-Voice-AI-Platform-with-TTS-Voice-Conversion-and-Generative-Audio-1f1551fcfb0a80b09f5ee7cabf5977c2).

## 🎯 Training Options

### 1. Cloud Training (Recommended)

#### AWS EC2 g5.xlarge
- Instance: g5.xlarge (1x NVIDIA A10G GPU, 24GB VRAM)
- Cost: ~$1.212/hour
- Recommended for: Full model training

#### Lightning.ai (Alternative)
- Free tier: 35 hours of GPU time
- GPU: NVIDIA A100 (40GB VRAM)
- Recommended for: Fine-tuning and experimentation
- Sign up at: https://lightning.ai

## 🚀 Model Training Guide

### 1. StyleTTS2 Training
review: https://github.com/yl4579/StyleTTS2/discussions/81

#### Prerequisites
```bash
# Install dependencies
pip install -r StyleTTS2/requirements.txt
pip install phonemizer
sudo apt-get install espeak-ng
```

#### Training Process
1. **Data Preparation**
   - Format: `filename.wav|transcription|speaker`
   - Sample rate: 24kHz
   - Place data in `StyleTTS2/Data/` directory

2. **Training Commands**
```bash
# First stage training
accelerate launch train_first.py --config_path ./Configs/config.yml

# Second stage training
python train_second.py --config_path ./Configs/config.yml
```

3. **Fine-tuning**
```bash
# Single GPU training
accelerate launch --mixed_precision=fp16 --num_processes=1 train_finetune_accelerate.py --config_path ./Configs/config_ft.yml
```

#### Docker Training
```bash
# Build training image
docker build -t styletts2-train -f StyleTTS2/Dockerfile.train .

# Run training
docker run --gpus all -v $(pwd)/StyleTTS2:/app styletts2-train
```


### 2. SEED-VC Training

#### Prerequisites
```bash
# Install dependencies
pip install -r seed-vc/requirements.txt
```

#### Training Process
1. **Data Preparation**
   - Place audio files in `seed-vc/dataset/`
   - Update configuration in `seed-vc/configs/`

2. **Training Command**
```bash
python train_v2.py --config_path configs/config_v2.yml
```

#### Docker Training
```bash
# Build training image
docker build -t seed-vc-train -f seed-vc/Dockerfile.train .

# Run training
docker run --gpus all -v $(pwd)/seed-vc:/app seed-vc-train
```

### 3. Make-An-Audio Training

#### Prerequisites
```bash
# Install dependencies
pip install -r Make-An-Audio/requirements.txt
```

#### Training Process
1. **Data Preparation**
   - Place audio files in `Make-An-Audio/data/`
   - Update configuration in `Make-An-Audio/configs/`
   - Run preprocessing scripts:
   ```bash
   cd Make-An-Audio
   python preprocess/prepare_data.py
   ```

2. **Training Command**
```bash
python main.py --config_path configs/train_config.yml
```

#### Docker Training
```bash
# Build training image
docker build -t make-an-audio-train -f Make-An-Audio/Dockerfile.train .

# Run training
docker run --gpus all -v $(pwd)/Make-An-Audio:/app make-an-audio-train
```

## 🐳 API Deployment

### 1. StyleTTS2 API

```bash
# Build API image
docker build -t styletts2-api -f StyleTTS2/Dockerfile.api .

# Run API
docker run --gpus all -p 8000:8000 styletts2-api
```

### 2. SEED-VC API

```bash
# Build API image
docker build -t seed-vc-api -f seed-vc/Dockerfile.api .

# Run API
docker run --gpus all -p 8001:8000 seed-vc-api
```

### 3. Make-An-Audio API

```bash
# Build API image
docker build -t make-an-audio-api -f Make-An-Audio/Dockerfile.api .

# Run API
docker run --gpus all -p 8002:8000 make-an-audio-api
```

## 📊 Performance Optimization

### GPU Memory Management
- Use gradient checkpointing for large models
- Enable mixed precision training (FP16)
- Adjust batch size based on available VRAM
- Use gradient accumulation for larger effective batch sizes

### Training Speed
- Use multiple GPUs when available
- Enable CUDA optimizations
- Use appropriate learning rate scheduling
- Implement early stopping

## 🔍 Troubleshooting

### Common Issues

1. **Out of Memory (OOM)**
   - Reduce batch size
   - Enable gradient checkpointing
   - Use mixed precision training
   - Clear GPU cache between runs

2. **Training Instability**
   - Check learning rate
   - Verify data preprocessing
   - Monitor gradient norms
   - Use gradient clipping

3. **Inference Quality**
   - Verify model checkpoint loading
   - Check audio preprocessing
   - Ensure correct sample rate
   - Validate input text normalization

## 📚 Additional Resources

- [Full Stack Voice AI Platform Guide](https://khaireddinearb.notion.site/A-Full-Stack-Voice-AI-Platform-with-TTS-Voice-Conversion-and-Generative-Audio-1f1551fcfb0a80b09f5ee7cabf5977c2)
- [StyleTTS2 Paper](https://arxiv.org/abs/2306.07691)
- [SEED-VC Repository](https://github.com/Plachtaa/VITS-fast-fine-tuning)
- [Make-An-Audio Repository](https://github.com/keithito/tacotron)
- [Inngest Documentation](https://www.inngest.com/docs)

## ⚠️ Important Notes

1. **GPU Requirements**
   - Minimum: NVIDIA GPU with 8GB VRAM
   - Recommended: NVIDIA A100 or better
   - Cloud options: AWS g5.xlarge or Lightning.ai

2. **Data Requirements**
   - High-quality audio recordings
   - Clean transcriptions
   - Proper speaker labeling
   - Appropriate sample rate (24kHz)

3. **License Compliance**
   - Ensure proper attribution
   - Check model licenses
   - Verify data usage rights
   - Follow ethical guidelines

## 🔄 Inngest Setup and Background Jobs

### 1. Installation
```bash
# Install Inngest CLI
npm install -g inngest-cli

# Install Inngest package in your Next.js project
cd 11labs-clone-frontend
pnpm add inngest
```

### 2. Configuration
Create a new file `src/lib/inngest.ts`:
```typescript
import { Inngest } from 'inngest';

export const inngest = new Inngest({
  name: 'Voice AI Platform',
  eventKey: process.env.INNGEST_EVENT_KEY,
});
```

### 3. Define Functions
Create a new file `src/app/api/inngest/route.ts`:
```typescript
import { inngest } from '@/lib/inngest';
import { serve } from 'inngest/next';

export const { GET, POST, PUT } = serve(inngest, [
  {
    id: 'process-voice-generation',
    on: 'voice/generate',
    fn: async ({ event, step }) => {
      // Your voice generation logic here
    },
  },
  {
    id: 'process-voice-conversion',
    on: 'voice/convert',
    fn: async ({ event, step }) => {
      // Your voice conversion logic here
    },
  },
]);
```

### 4. Running Inngest Dev Server
```bash
# Start Inngest dev server
pnpm inngest-dev

# In a separate terminal, start your Next.js app
pnpm dev
```

### 5. Environment Variables
Add to your `.env` file:
```env
INNGEST_EVENT_KEY=your_event_key
INNGEST_SIGNING_KEY=your_signing_key
```

### 6. Background Job Processing
Example of triggering a background job:
```typescript
import { inngest } from '@/lib/inngest';

// In your API route or server action
await inngest.send({
  name: 'voice/generate',
  data: {
    text: 'Hello world',
    voiceId: 'voice_123',
    userId: 'user_456',
  },
});
```

## 🚀 Complete Project Setup

1. **Frontend Setup**
```bash
cd 11labs-clone-frontend
pnpm install
pnpm prisma generate
pnpm dev
```

2. **Backend Services**
```bash
# Start all services using Docker Compose
docker-compose up -d

# Or start individual services
docker-compose up styletts2-api
docker-compose up seedvc-api
docker-compose up make-an-audio-api
```

3. **Database Setup**
```bash
# Generate Prisma client
pnpm prisma generate

# Push database schema
pnpm prisma db push

# Start Prisma Studio (optional)
pnpm prisma studio
```

4. **Environment Configuration**
Create `.env` file with all required variables:
```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"

# Authentication
NEXTAUTH_SECRET="your-secret"

# AWS
AWS_ACCESS_KEY_ID="your-aws-key"
AWS_SECRET_ACCESS_KEY="your-aws-secret"
AWS_REGION="your-aws-region"
AWS_BUCKET_NAME="your-bucket-name"

# Inngest
INNGEST_EVENT_KEY="your-event-key"
INNGEST_SIGNING_KEY="your-signing-key"

# API Keys
STYLETTS2_API_KEY="your-key"
SEEDVC_API_KEY="your-key"
MAKE_AN_AUDIO_API_KEY="your-key"
```

5. **Development Workflow**
- Frontend runs on `http://localhost:3000`
- StyleTTS2 API on `http://localhost:8000`
- SEED-VC API on `http://localhost:8001`
- Make-An-Audio API on `http://localhost:8002`
- Inngest Dev Server on `http://localhost:3000/api/inngest` 