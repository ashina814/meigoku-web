# Cloudflare Pages 検証公開

このリポジトリのCloudflare Pagesプロジェクトは `meigoku-web` です。production branch は `main`、ビルドコマンドは `npm run build`、出力先は `dist`、Node.js は `22.16.0` を使用します。

## 現在の検証公開設定

検証URLは `https://meigoku-web.pages.dev` です。検索公開はまだ開始しないため、production の環境変数は次のとおりに設定します。

```text
NODE_VERSION=22.16.0
PUBLIC_SITE_URL=https://meigoku-web.pages.dev
PUBLIC_SITE_INDEXABLE=false
```

Preview 環境には次だけを設定します。`PUBLIC_SITE_URL` は設定しません。これにより、Preview が production の canonical や共有メタデータを出力することを防ぎます。

```text
NODE_VERSION=22.16.0
PUBLIC_SITE_INDEXABLE=false
```

`pages.dev` の production URL と Preview URL は `_headers` で `X-Robots-Tag: noindex, nofollow` を返します。カスタムドメインの設定、検索登録、sitemap はこの段階では追加しません。

## 公開時の確認

1. `main` をマージし、Cloudflare Pages の production deployment を完了する。
2. `/`、`/join`、`/soul-reading`、`/soul-reading/result/tenka` を開く。
3. HTML の canonical、OGP、Twitter Card が `https://meigoku-web.pages.dev` の絶対URLであることを確認する。
4. `X-Robots-Tag` と HTML の robots がともに `noindex, nofollow` であることを確認する。
5. Discord の共有プレビューを確認する。

管理者の承認後にカスタムドメインへ切り替える場合も、まず Cloudflare Pages の production 環境変数だけを新しい HTTPS origin と `PUBLIC_SITE_INDEXABLE=false` に更新します。検索公開は別の承認作業です。その際は custom domain 用のヘッダー方針も別途確認します。

## ロールバック

問題時は Cloudflare Pages で直前の正常 deployment を選んでロールバックします。`main` のコードを不用意に巻き戻さず、`PUBLIC_SITE_INDEXABLE=false` を維持してください。入城受付や招待URLに変更があれば、あわせて `src/data/join.ts` の公開設定を確認します。
