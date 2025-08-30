use anyhow::Result;
use rust_bert::pipelines::sentence_embeddings::{
    SentenceEmbeddingsBuilder, SentenceEmbeddingsModelType
};
use serde::{Deserialize, Serialize};
use std::fs;
use std::path::Path;
use std::collections::HashMap;
use std::time::Instant;

#[derive(Debug, Serialize, Deserialize, Clone)]
struct Writeup {
    id: String,
    title: String,
    description: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    vector: Option<Vec<f32>>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
struct VectorEntry {
    id: String,
    vector: Vec<f32>,
}

fn main() -> Result<()> {
    println!("🚀 Initializing sentence transformer model...");
    let start_time = Instant::now();
    
    // Initialize the model
    let model = SentenceEmbeddingsBuilder::remote(SentenceEmbeddingsModelType::AllMiniLmL6V2)
        .with_device(tch::Device::cuda_if_available())
        .create_model()?;
    
    println!("✅ Model loaded in {:?}", start_time.elapsed());

    // Read all text files from out/writeups/
    let writeups_dir = "../../../out/writeups";
    let mut text_contents = HashMap::new();
    
    println!("📖 Reading text files from {}...", writeups_dir);
    
    for entry in fs::read_dir(writeups_dir)? {
        let entry = entry?;
        let path = entry.path();
        
        if path.is_file() && path.extension().and_then(|s| s.to_str()) == Some("txt") {
            if let Some(file_name) = path.file_stem().and_then(|s| s.to_str()) {
                let content = fs::read_to_string(&path)?;
                text_contents.insert(file_name.to_string(), content);
                println!("   Found: {}.txt", file_name);
            }
        }
    }
    
    println!("📊 Found {} text files", text_contents.len());

    // Read existing writeups.json to get the list of writeup IDs
    let writeups_path = "../../../out/writeups.json";
    if !Path::new(writeups_path).exists() {
        anyhow::bail!("writeups.json not found at {}", writeups_path);
    }
    
    let writeups_content = fs::read_to_string(writeups_path)?;
    let writeups: Vec<Writeup> = serde_json::from_str(&writeups_content)?;
    
    println!("🔗 Matching {} writeups with text files...", writeups.len());

    let mut vectors = Vec::new();
    let mut processed_count = 0;
    let mut missing_count = 0;

    // Create a vector to store all texts for batch processing
    let mut texts_to_embed = Vec::new();
    let mut writeup_ids = Vec::new(); // Track which writeup ID each text belongs to
    
    for writeup in writeups.iter() {
        if let Some(text_content) = text_contents.get(&writeup.id) {
            // Clean and prepare text for embedding
            let clean_text = clean_text_for_embedding(text_content);
            if !clean_text.is_empty() {
                texts_to_embed.push(clean_text);
                writeup_ids.push(writeup.id.clone());
            }
        } else {
            println!("   ⚠️  No text file found for writeup ID: {}", writeup.id);
            missing_count += 1;
        }
    }

    println!("🧠 Generating embeddings for {} texts...", texts_to_embed.len());
    
    // Generate embeddings in batches (more efficient)
    if !texts_to_embed.is_empty() {
        match model.encode(&texts_to_embed) {
            Ok(embeddings) => {
                for (i, embedding) in embeddings.iter().enumerate() {
                    let vector_entry = VectorEntry {
                        id: writeup_ids[i].clone(),
                        vector: embedding.clone(),
                    };
                    vectors.push(vector_entry);
                    processed_count += 1;
                    println!("   ✓ Embedded: {} ({} dimensions)", 
                             writeup_ids[i], embedding.len());
                }
            }
            Err(e) => {
                eprintln!("✗ Error generating embeddings: {}", e);
            }
        }
    }

    // Create vectors.json file
    let vectors_path = "../../../out/vectors.json";
    let vectors_json = serde_json::to_string_pretty(&vectors)?;
    fs::write(vectors_path, vectors_json)?;
    
    println!("\n✅ Completed!");
    println!("• Writeups processed: {}", writeups.len());
    println!("• Vectors generated: {}", processed_count);
    println!("• Missing text files: {}", missing_count);
    println!("• Total time: {:?}", start_time.elapsed());
    println!("• Vectors saved to: {}", vectors_path);
    
    Ok(())
}

fn clean_text_for_embedding(text: &str) -> String {
    // Basic cleaning - keep it simple since the model handles tokenization
    text.chars()
        .filter(|c| !c.is_ascii_control()) // Remove control characters
        .collect::<String>()
        .trim()
        .to_string()
}
