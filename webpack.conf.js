const webpack = require("webpack");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");
const SentryCliPlugin = require("@sentry/webpack-plugin");

const isDevelopment = true;

const HtmlWebpackPlugin = require("html-webpack-plugin");

const ini = require("ini");
const fs = require("fs");
const path = require("path");
const config = ini.parse(fs.readFileSync("./sentry.ini", "utf-8"));

const enableSentry = false;
const envName = config.sentry.env;
const dsn = enableSentry ? config.sentry.dsn : null;

module.exports = {
    // It is suggested to run both `react-refresh/babel` and the plugin in the `development` mode only,
    // even though both of them have optimisations in place to do nothing in the `production` mode.
    // If you would like to override Webpack's defaults for modes, you can also use the `none` mode -
    // you then will need to set `forceEnable: true` in the plugin's options.
    mode: isDevelopment ? "development" : "production",
    cache: { type: "filesystem" },
    entry: {
        index: "./javascript/index.js",
        header: "./javascript/header.js",
        vendor: "./javascript/vendor.js",
        seeker: "./javascript/seeker.js",
        dashboard: "./javascript/components/Dashboard/dashboard.tsx",
        form: "./javascript/form.js",
        contact: "./javascript/contact.js",
        feedback: "./javascript/feedback.js",
        updateEditor: "./javascript/dashboardUpdateEditor.js",
        organization: "./javascript/organization.js",
        rfi: "./javascript/rfi.js",
        faq: "./javascript/faqPage.js",
        tos: "./javascript/tos.js",
        about: "./javascript/about.js",
        capabilities: "./javascript/capabilities.js",
        privacy: "./javascript/privacy.js",
        disclaimer: "./javascript/disclaimer.js",
        contributors: "./javascript/contributors.js",
        statement: "./javascript/statement.js",
        medicalProgramReview: "./javascript/medicalProgramReview.js",
        medicalProgramReview2021: "./javascript/medicalProgramReview2021.js",
    },
    module: {
        rules: [
            {
                test: /\.(gif|jpe?g|tiff?|png|bmp)$/i,
                use: [{ loader: "file-loader" }],
                exclude: [/node_modules/, "/javascript/indexBundle.js"],

                type: "asset/resource",
            },
            {
                test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
                use: [{ loader: "file-loader" }],
                exclude: [/node_modules/, "/javascript/indexBundle.js"],

                type: "asset/resource",
            },

            {
                test: /\.(sa|sc|c)ss$/,
                use: ["style-loader", "css-loader", "sass-loader"],
                // type: "asset/resource",
            },
            {
                test: /\.[jt]sx?$/,
                exclude: [
                    /node_modules/,
                    "/javascript/indexBundle.js",
                    "/javascript/lib/*",
                ],
                use: [
                    // ... other loaders
                    {
                        loader: "babel-loader",
                        options: {
                            cacheCompression: false,
                            cacheDirectory: true,
                            // ... other options
                            plugins: [
                                // ... other plugins
                                isDevelopment && require("react-refresh/babel"),
                                [
                                    "babel-plugin-import",
                                    {
                                        libraryName: "@material-ui/core",
                                        libraryDirectory: "esm",
                                        camel2DashComponentName: false,
                                    },
                                    "core",
                                ],
                                [
                                    "babel-plugin-import",
                                    {
                                        libraryName: "@material-ui/icons",
                                        libraryDirectory: "esm",
                                        camel2DashComponentName: false,
                                    },
                                    "icons",
                                ],

                                "@babel/plugin-transform-runtime",
                            ].filter(Boolean),
                        },
                    },
                ],
            },
        ],
    },
    resolve: {
        extensions: ["*", ".js", ".jsx", ".tsx", ".ts"],
    },
    plugins: [
        ...[
            enableSentry &&
            new SentryCliPlugin({
                include: ".",
                org: "frontend",
                project: envName,
                url: enableSentry ? dsn : "",
                ignore: ["node_modules", "webpack.config.js"],
            }),
        ].filter(Boolean),
        new HtmlWebpackPlugin({
            title: "Virtual Industry Day",
            filename: "./index.html",
            template: "./assets/index.html",
            chunks: ["index"],
            minify: false,
        }),
        new HtmlWebpackPlugin({
            title: "Dashboard",
            filename: "./dashboard.html",
            template: "./assets/dashboard.html",
            chunks: ["dashboard"],
            minify: false,
        }),
        new HtmlWebpackPlugin({
            title: "Form",
            filename: "./projectForm.html",
            template: "./assets/form.html",
            chunks: ["form"],
            minify: false,
        }),
        new HtmlWebpackPlugin({
            title: "Statement of Need",
            filename: "./statement.html",
            template: "./assets/statement.html",
            chunks: ["statement"],
            minify: false,
        }),
        new HtmlWebpackPlugin({
            title: "Projects",
            filename: "./rfi.html",
            template: "./assets/rfi.html",
            chunks: ["rfi"],
            minify: false,
        }),
        new HtmlWebpackPlugin({
            title: "Seeker About Page",
            filename: "./seeker.html",
            template: "./assets/seeker.html",
            chunks: ["seeker"],
            minify: false,
        }),
        new HtmlWebpackPlugin({
            title: "Vendor About Page",
            filename: "./vendor.html",
            template: "./assets/vendor.html",
            chunks: ["vendor"],
            minify: false,
        }),
        new HtmlWebpackPlugin({
            title: "Contact Us",
            filename: "./contact.html",
            template: "./assets/contact.html",
            chunks: ["contact"],
            minify: false,
        }),
        new HtmlWebpackPlugin({
            title: "Feedback",
            filename: "./feedback.html",
            template: "./assets/feedback.html",
            chunks: ["feedback"],
            minify: false,
        }),
        new HtmlWebpackPlugin({
            title: "Dashboard Update Editor",
            filename: "./dashboardUpdateEditor.html",
            template: "./assets/dashboardUpdateEditor.html",
            chunks: ["updateEditor"],
            minify: false,
        }),
        new HtmlWebpackPlugin({
            title: "Organization",
            filename: "./organization.html",
            template: "./assets/organization.html",
            chunks: ["organization"],
            minify: false,
        }),
        new HtmlWebpackPlugin({
            title: "FAQ",
            filename: "./faq.html",
            template: "./assets/faq.html",
            chunks: ["faq"],
            minify: false,
        }),
        new HtmlWebpackPlugin({
            title: "Terms of Service",
            filename: "./tos.html",
            template: "./assets/footerPage.html",
            chunks: ["tos"],
            minify: false,
        }),
        new HtmlWebpackPlugin({
            title: "About Us",
            filename: "./about.html",
            template: "./assets/footerPage.html",
            chunks: ["about"],
            minify: false,
        }),
        new HtmlWebpackPlugin({
            title: "Capabilities",
            filename: "./capabilities.html",
            template: "./assets/footerPage.html",
            chunks: ["capabilities"],
            minify: false,
        }),
        new HtmlWebpackPlugin({
            title: "Medical Program Review 2020",
            filename: "./medicalProgramReview.html",
            template: "./assets/medicalProgramReview.html",
            chunks: ["medicalProgramReview"],
            minify: false,
        }),
        new HtmlWebpackPlugin({
            title: "Privacy Policy",
            filename: "./privacy.html",
            template: "./assets/footerPage.html",
            chunks: ["privacy"],
            minify: false,
        }),
        new HtmlWebpackPlugin({
            title: "Disclaimer",
            filename: "./disclaimer.html",
            template: "./assets/footerPage.html",
            chunks: ["disclaimer"],
            minify: false,
        }),
        new HtmlWebpackPlugin({
            title: "Contributors",
            filename: "./contributors.html",
            template: "./assets/footerPage.html",
            chunks: ["contributors"],
            minify: false,
        }),
        new HtmlWebpackPlugin({
            title: "Medical Program Review Video 2021",
            filename: "./medicalProgramReview2021.html",
            template: "./assets/footerPage.html",
            chunks: ["medicalProgramReview2021"],
            minify: false,
        }),
        new HtmlWebpackPlugin({
            title: "Success",
            filename: "./validateSuccess.html",
            template: "./assets/validateSuccess.html",
            chunks: [],

            minify: false,
        }),
        // ... other plugins
        new webpack.HotModuleReplacementPlugin(),
        new ReactRefreshWebpackPlugin(),
        new NodePolyfillPlugin(),
        // new webpack.ProvidePlugin({
        //     process: "process/browser",
        // }),

        new webpack.DefinePlugin({
            "process.env.name": JSON.stringify(envName),
            "process.env.dsn": JSON.stringify(dsn),
        }),
    ],
    output: {
        path: __dirname + "/dist",
        publicPath: "/dist/",
        filename: "[name].js",
    },
    devServer: {
        port: 80,
        static: [
            {
                directory: __dirname + "/javascript/lib",
                publicPath: "/javascript/lib",
            },
            {
                directory: __dirname + "/javascript",
                publicPath: "/javascript/",
            },
            {
                directory: __dirname + "/php",
                publicPath: "/php",
            },
            {
                directory: __dirname + "/css",
                publicPath: "/css",
            },
        ],
        // public: `localhost`,
        historyApiFallback: {
            rewrites: [
                { from: /^\/$/, to: "/dist/index.html" },
                { from: /^\/index\.html$/, to: "/dist/index.html" },
                { from: /^\/contact\.html$/, to: "/dist/contact.html" },
                { from: /^\/dashboard\.html$/, to: "/dist/dashboard.html" },
                { from: /^\/feedback\.html$/, to: "/dist/feedback.html" },
                { from: /^\/projectForm\.html$/, to: "/dist/projectForm.html" },
                {
                    from: /^\/dashboardUpdateEditor\.html$/,
                    to: "/dist/dashboardUpdateEditor.html",
                },
                {
                    from: /^\/organization\.html$/,
                    to: "/dist/organization.html",
                },
                { from: /^\/faq\.html$/, to: "/dist/faq.html" },
                { from: /^\/rfi\.html$/, to: "/dist/rfi.html" },
                { from: /^\/tos\.html$/, to: "/dist/tos.html" },
                { from: /^\/about\.html$/, to: "/dist/about.html" },
                {
                    from: /^\/capabilities\.html$/,
                    to: "/dist/capabilities.html",
                },
                { from: /^\/privacy\.html$/, to: "/dist/privacy.html" },
                { from: /^\/disclaimer\.html$/, to: "/dist/disclaimer.html" },
                {
                    from: /^\/contributors\.html$/,
                    to: "/dist/contributors.html",
                },
                { from: /^\/seeker\.html$/, to: "/dist/seeker.html" },
                { from: /^\/vendor\.html$/, to: "/dist/vendor.html" },
                { from: /^\/statement\.html$/, to: "/dist/statement.html" },
                {
                    from: /^\/validateSuccess\.html$/,
                    to: "/dist/validateSuccess.html",
                },
                {
                    from: /^\/medicalProgramReview\.html$/,
                    to: "/dist/medicalProgramReview.html",
                },
                {
                    from: /^\/medicalProgramReview2021\.html$/,
                    to: "/dist/medicalProgramReview2021.html",
                },
                // { from: /^\/subpage/, to: "/views/subpage.html" },
                { from: /./, to: "/views/404.html" },
                { from: "", to: "/dist/index.html" },
            ],
        },
        proxy: {
            "/users": {
                target: "http://localhost:3000",
                secure: false,
            },
            "/projects": {
                target: "http://localhost:3001",
                secure: false,
            },
            "/form": {
                target: "http://localhost:3002",
                secure: false,
            },
            "/email": {
                target: "http://localhost:3003",
                secure: false,
            },
            "/organizations": {
                target: "http://localhost:3004",
                secure: false,
            },
            "/uploads": {
                target: "http://localhost:5000",
                secure: false,
            },
        },
        // historyApiFallback: false,
        hot: "only",
        liveReload: false,
    },

    // ... other configuration options
};
