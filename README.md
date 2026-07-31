# 冥獄城公式Webサイト

冥獄城の外部向け公式Webサイトを作るための、Astro製・静的サイト基盤です。これは完成デザインや本番コンテンツではなく、将来のデザイン仕様を安全に適用するための初期構成です。

## セットアップと実行

Node.js 22以上とnpmを使用します。

```bash
npm install
npm run dev
```

ビルドとローカルプレビューは次のとおりです。

```bash
npm run build
npm run preview
```

型・Astroの確認は `npm run check` で実行できます。

## 構成

```
public/                 静的アセット（画像の用途別フォルダ、favicon、OG画像）
src/components/         共通・ページ固有・UIコンポーネント
src/content/ranks/      身分・階級のコンテンツコレクション
src/data/               サイト設定、ナビゲーション、入城設定、表示用データ
src/layouts/            共通レイアウトとSEOメタ情報の出力箇所
src/lib/                公開判定・SEOの共通処理
src/pages/              ルーティングされる静的ページとrobots.txt
src/styles/             仮のデザイントークンと最低限の共通スタイル
```

`src/data/navigation.ts` がヘッダーナビゲーションの唯一の定義元です。入城案内の状態、日時、招待URLは `src/data/join.ts` で管理します。`inviteUrl` が空のままなら、ページにリンクは表示されません。

## コンテンツ公開の条件

外部向けページに掲載できるコンテンツは、`src/lib/publication.ts` の `isPubliclyVisible` により、次の両方を満たすものだけです。

```ts
publishState === "approved" && visibility === "public"
```

未承認の原稿は `draft` または `review` にし、公開済みに見える内容を記載しないでください。サンプルの制度、階級、権限、歴史、個人情報、Discord内部情報、実際の招待URLを追加してはいけません。

### Publicリポジトリでの情報管理

公開判定はWebサイトへの表示だけを制御するものであり、GitHub上の秘匿性は提供しません。`visibility: "internal"` はサイト上で非表示にするための値であり、このPublicリポジトリに置いても安全な内容だけに使用してください。

一次資料との対応関係や内部の承認履歴は、このPublicリポジトリでは管理しません。必要な場合は、公開しても問題のない識別子だけを `publicSourceKeys` に記録できます。Discord ID、個人名、内部資料名、内部ファイルパス、相談・処分・評価情報、非公開URLは、`publicSourceKeys` を含むこのリポジトリのいかなるファイルにも記録しないでください。

## 検索エンジンへの公開を避けるには

試作中は `src/data/site.ts` の `robots` を `"noindex, nofollow"` のままにしてください。ビルドされる `/robots.txt` もこれに応じてクロールを抑制します。本番公開前に、ホスティング側のアクセス制限と検索エンジンの設定もあわせて確認してください。

## デザイン適用時の注意

`src/styles/tokens.css` の値はすべて仮値です。将来のデザイン仕様はまずこのトークンを置き換え、必要に応じてコンポーネント単位でスタイルを追加してください。現時点の表示は構造確認のための最小限であり、世界観の装飾やアニメーションは実装していません。

将来、Claude等から受け取るデザイン仕様を適用する際も、公開判定、空の招待URLをリンクにしない制約、アクセシブルな見出し構造を維持してください。

## トップページv3の仮素材

`public/images/brand/meigoku-castle-hero.png` は、正式採用したサーバーアイコン由来の冥獄城外観です。Hero画像のパスは `src/data/home.ts` の `homeAssets` で一元管理しています。
