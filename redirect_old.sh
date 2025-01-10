#!/bin/bash

cd "$(dirname "$0")"
redirect_root="posts"
find . -type f -name "*.html" | while read -r file; do
    relative_path="${file#./}"
    base_path="${relative_path%.html}"

    redirect_dir="$redirect_root/$base_path"
    mkdir -p "$redirect_dir"

    redirect_file="$redirect_dir/index.html"
    cat > "$redirect_file" <<EOF
<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="refresh" content="0; url=/${relative_path}" />
</head>
<body>
    <p>Redirecting to <a href="/${relative_path}">${relative_path}</a>...</p>
</body>
</html>
EOF

    echo "Created redirect for: $relative_path -> $redirect_file"
done

echo "Done."
