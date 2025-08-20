import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  layout("./routes/layout.tsx", [
    index("routes/home.tsx"),
    route("catalog", "./routes/catalog.tsx"),
    route("book/:id", "./routes/book-detail.tsx"),
    route("news", "./routes/news.tsx"),
    route("news/:id", "./routes/news-detail.tsx"),
  ]),
  route("admin", "./routes/admin/layout.tsx", [
    index("routes/admin/index.tsx"),
    route("users", "./routes/admin/users/index.tsx"),
    route("users/new", "./routes/admin/users/NewUser.tsx"),
    route("users/:id/edit", "./routes/admin/users/edit.tsx"),
    route("users/:id/role", "./routes/admin/users/changerole.tsx"),
    route("news", "./routes/admin/news/index.tsx"), 
    route("news/new", "./routes/admin/news/new.tsx"),
    route("news/:id/edit", "./routes/admin/news/edit.tsx"),
    route("books", "./routes/admin/books/index.tsx"),
    route("books/new", "./routes/admin/books/new.tsx"),
    route("books/:id/edit", "./routes/admin/books/edit.tsx"),

  ]),
  route("login", "./routes/login.tsx"),
  route("sign-up", "./routes/sign-up.tsx"),
] satisfies RouteConfig;
