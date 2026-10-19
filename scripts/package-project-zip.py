#!/usr/bin/env python3
import os
import zipfile
import sys

def create_project_zip(output_path):
    root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
    
    # Exclude list of paths and patterns
    exclude_dirs = {
        'node_modules',
        '.git',
        '.aistudio',
        'dist',
        'dist-bin',
        'coverage',
        '.cache',
        '.vite',
        'tmp',
        'temp',
        'uploads',
        'optimedia_uploads'
    }
    
    exclude_extensions = {
        '.mp4', '.mkv', '.mov', '.avi', '.webm', '.flv', '.wmv', '.m4v',
        '.log', '.tmp'
    }
    
    # Specific files to exclude from public/
    exclude_public_files = {
        'optimedia-studio-linux-x64',
        'optimedia-studio.zip'
    }

    print(f"Creating clean project archive at: {output_path}")
    
    os.makedirs(os.path.dirname(os.path.abspath(output_path)), exist_ok=True)
    
    with zipfile.ZipFile(output_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk(root_dir):
            # Prune excluded directories in-place
            dirs[:] = [d for d in dirs if d not in exclude_dirs and not d.startswith('.')]
            
            for file in sorted(files):
                # Check extension
                _, ext = os.path.splitext(file)
                if ext.lower() in exclude_extensions:
                    continue
                
                # Check secrets or env files
                if file.startswith('.env') and file != '.env.example':
                    continue
                
                if file in exclude_public_files:
                    continue
                
                if file.endswith('.zip') or file.endswith('.tar.gz'):
                    continue

                full_path = os.path.join(root, file)
                rel_path = os.path.relpath(full_path, root_dir)
                
                # Normalize slashes for zip format
                zip_path = rel_path.replace(os.sep, '/')
                
                # Add file to zip
                zipf.write(full_path, zip_path)
                print(f"  + {zip_path}")

    size_mb = os.path.getsize(output_path) / (1024 * 1024)
    print(f"Successfully created {output_path} ({size_mb:.2f} MB)")

if __name__ == '__main__':
    target = sys.argv[1] if len(sys.argv) > 1 else os.path.join(os.path.dirname(__file__), '../public/downloads/optimedia-studio.zip')
    create_project_zip(target)
