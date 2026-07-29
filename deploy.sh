#!/usr/bin/env bash
#
# 上線腳本：建置 → 上傳到 hank-kuo.com/intro
#
# 用法：
#   ./deploy.sh            建置並上傳
#   ./deploy.sh --dry-run  只顯示會傳哪些檔案，不真的上傳（建議先跑一次）
#
# 需要：~/.ssh/id_ed25519（連主機用的鑰匙）。沒有的話會在下面先擋下來並說明。
#
set -euo pipefail

HOST="hankkuoc@hank-kuo.com"
PORT="7822"
REMOTE="/home/hankkuoc/public_html/intro/"
KEY="$HOME/.ssh/id_ed25519"

cd "$(dirname "$0")"

DRY=""
if [[ "${1:-}" == "--dry-run" ]]; then
  DRY="--dry-run"
  echo "［預演模式］只列出會傳的檔案，不會真的上傳"
fi

# --- 先確認鑰匙在不在 ---
if [[ ! -f "$KEY" ]]; then
  cat <<'MSG' >&2
找不到連線用的鑰匙：~/.ssh/id_ed25519

這台電腦沒有登入主機的憑證，所以無法上傳。三種解法：

1. 從原本那台電腦把 ~/.ssh/id_ed25519 與 .pub 複製過來
   用隨身碟或加密方式親手複製，不要用聊天視窗、雲端硬碟或 email 傳。
   複製完成後執行：chmod 600 ~/.ssh/id_ed25519

2. 在這台電腦產生新的鑰匙，再把公鑰加到主機
   ssh-keygen -t ed25519 -C "hank@this-mac"
   ssh-copy-id -p 7822 hankkuoc@hank-kuo.com

3. 這次先用密碼手動上傳一次
   rsync -az --delete -e "ssh -p 7822" dist/ hankkuoc@hank-kuo.com:/home/hankkuoc/public_html/intro/
MSG
  exit 1
fi

# --- 建置 ---
echo "→ 建置中"
npm run build

if [[ ! -f dist/index.html ]]; then
  echo "建置結果不完整：找不到 dist/index.html" >&2
  exit 1
fi

# --- 上傳 ---
# --delete：遠端多出來的舊檔會被移除，讓線上跟 dist/ 完全一致
echo "→ 上傳到 $HOST:$REMOTE"
rsync -az --delete $DRY -e "ssh -p $PORT" dist/ "$HOST:$REMOTE"

if [[ -n "$DRY" ]]; then
  echo "預演結束，沒有實際變更。確認上面的清單沒問題後，不加 --dry-run 再跑一次。"
else
  echo "完成 → https://hank-kuo.com/intro/"
fi
