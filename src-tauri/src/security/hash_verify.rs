use crate::error::AppError;
use sha2::{Digest, Sha256};
use std::fs::File;
use std::io::Read;

/// Verify SHA256 hash of a file
#[allow(dead_code)]
pub fn verify_file_hash(file_path: &str, expected_hash: &str) -> Result<bool, AppError> {
    let mut file = File::open(file_path).map_err(|e| {
        AppError::FileRead(format!("Failed to open file for hash verification: {}", e))
    })?;

    let mut hasher = Sha256::new();
    let mut buffer = [0; 8192];

    loop {
        let n = file
            .read(&mut buffer)
            .map_err(|e| AppError::FileRead(format!("Failed to read file for hashing: {}", e)))?;
        if n == 0 {
            break;
        }
        hasher.update(&buffer[..n]);
    }

    let hash_result = format!("{:x}", hasher.finalize());
    Ok(hash_result == expected_hash)
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::fs;

    #[test]
    fn test_verify_file_hash() {
        // Create a temporary test file
        let test_content = b"Hello, PixelForge!";
        let test_file = "/tmp/pixelforge_hash_test.txt";

        fs::write(test_file, test_content).unwrap();

        // SHA256 of "Hello, PixelForge!" is this:
        let expected_hash = "2731adc010348fead16f83b0550cd69789ae0821ac7519a09e78ff71eca6f579";

        let result = verify_file_hash(test_file, expected_hash);
        assert!(result.is_ok());
        assert!(result.unwrap());

        // Test with wrong hash
        let wrong_hash = "0000000000000000000000000000000000000000000000000000000000000000";
        let result = verify_file_hash(test_file, wrong_hash);
        assert!(result.is_ok());
        assert!(!result.unwrap());

        // Cleanup
        fs::remove_file(test_file).ok();
    }

    #[test]
    fn test_verify_file_not_found() {
        let result = verify_file_hash("/nonexistent/file.txt", "abc123");
        assert!(result.is_err());
        if let Err(e) = result {
            assert!(matches!(e, AppError::FileRead(_)));
        }
    }
}
