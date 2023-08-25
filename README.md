## Setup project

1. Clone this repo `git clone https://github.com/thelastandrew/frontendiya-tech.git`
2. Install dependencies `yarn install`
3. Create `.env` file, use `.env.example` as an example

```.env
VITE_API_KEY=firebase-app-api-key
VITE_AUTH_DOMAIN=firebase-app-auth-domain
VITE_AUTH_FUNCTION_DOMAIN=firebase-app-function-trigger
VITE_PROJECT_ID=firebase-app-project-id
VITE_STORAGE_BUCKET=firebase-app-storage-bucket
VITE_MESSAGING_SENDER_ID=firebase-app-messaging-sender-id
VITE_APP_ID=firebase-app-id
VITE_DB_URL=firebase-db-url
```

4. Run the project `yarn dev`

## This project using LF line separator

1. To install in Webstorm: File -> Settings -> Editor -> Code Style -> Line Separator -> Unix and macOS
2. To install in VS Code: Ctrl+Shift+P -> `Change End of Line Sequence` -> LF

## Bundle Analyzer

To see the application bundle of your project, you can run the command `npm, pnpm or yarn vite-bundle-visualizer` in the root directory of your project. This will launch vite-bundle-visualizer and display an interactive visualization of the contents and size of your bundle.
