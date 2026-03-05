-- CreateTable
CREATE TABLE "Settings" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "shop" TEXT NOT NULL,
    "buttonText" TEXT NOT NULL DEFAULT 'Add to Wishlist',
    "buttonColor" TEXT NOT NULL DEFAULT '#e44444',
    "buttonStyle" TEXT NOT NULL DEFAULT 'Icon + Text',
    "iconStyle" TEXT NOT NULL DEFAULT '❤️',
    "launchType" TEXT NOT NULL DEFAULT 'Floating Button',
    "buttonPosition" TEXT NOT NULL DEFAULT 'Bottom Right',
    "wishlistDisplay" TEXT NOT NULL DEFAULT 'Popup Window',
    "wishlistName" TEXT NOT NULL DEFAULT 'My Wishlist',
    "requireLogin" BOOLEAN NOT NULL DEFAULT false
);

-- CreateTable
CREATE TABLE "WishlistItem" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "shop" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "price" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "Settings_shop_key" ON "Settings"("shop");
