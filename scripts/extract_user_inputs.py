import json
import os

logs_dir = r"C:\Users\vishn\.gemini\antigravity-ide\brain\97bc51ee-02d3-486d-93dd-a37d5aa0bdcb\.system_generated\logs"
out_path = "scripts/all_user_inputs.txt"

with open(out_path, "w", encoding="utf-8") as out_f:
    for filename in os.listdir(logs_dir):
        if filename.endswith(".jsonl"):
            filepath = os.path.join(logs_dir, filename)
            with open(filepath, 'r', encoding='utf-8') as f:
                for line in f:
                    try:
                        data = json.loads(line)
                        if data.get("type") == "USER_INPUT":
                            content = data.get("content", "")
                            if "==Start of PDF==" in content:
                                out_f.write(content)
                                out_f.write("\n\n" + "="*50 + "\n\n")
                    except Exception as e:
                        pass
print("Done writing user inputs.")
