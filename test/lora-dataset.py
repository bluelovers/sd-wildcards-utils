import os
import re

# 指定需要遍歷的路徑
your_path = 'C:\\Users\\User\\Downloads\\新增資料夾 (6)'

# 遍歷指定路徑下的所有.txt文件
for root, dirs, files in os.walk(your_path):
    for file in files:
        if file.endswith('.txt'):
            file_path = os.path.join(root, file)

            print(file)

            with open(file_path, 'r', encoding='utf-8') as f:
                lines = f.readlines()

            # 检查是否存在需要刪除的内容
            with (open(file_path, 'w', encoding='utf-8') as f):
                negative_prompt_found = False
                lines_new = []
                for i, line in enumerate(lines):
                    # 檢查是否達到 "Negative prompt:" 標記行
                    if line.startswith('Negative prompt:'):
                        negative_prompt_found = True
                        break

                    line = line.replace(r",\s*eyes focus\s*,", ",")
                    line = re.sub(r"\((.+?)(?::\d+(?:.\d+)?)?\)", r'\1', line)
                    line = line.strip()

                    if len(line):
                        line += "\n"
                        lines_new.append(line)

                if negative_prompt_found:
                    lines_new.pop(0)

                lines_new.insert(0, 'n0n1pp1e5')

                f.writelines(lines_new)
