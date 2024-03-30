# Next-Backoffice

This is a backoffice to use according with your needs while learning NextJs at the same time.
This app is using Next.js 13 (app directory) and NextUI (v2).

## Technologies Used

- [Next.js 13](https://nextjs.org/docs/getting-started)
- [NextUI v2](https://nextui.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Tailwind Variants](https://tailwind-variants.org)
- [TypeScript](https://www.typescriptlang.org/)
- [Framer Motion](https://www.framer.com/motion/)
- [next-themes](https://github.com/pacocoursey/next-themes)

## How to Use

### Install dependencies

```bash
npm install
```

### Create .env.local

create a .env.local in next-backoffice folder with the variables:

- MONGODB_URI: with de URI of your MongoDB connection
- MONGO_DATABASE: DB with a name of your choice
- MONGO_COLLECTION: Collection with a name of your choice

### Import sample data to mongo

```bash
cd dev-data
node importData.js
```

### Run the development server

```bash
npm run dev
```

## License

Licensed under the [MIT license](https://github.com/nextui-org/next-app-template/blob/main/LICENSE).
