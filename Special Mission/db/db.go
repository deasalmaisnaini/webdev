package db

import (
	"context"
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// User adalah struktur data untuk item dalam keranjang belanja.
type User struct {
	ID        primitive.ObjectID `bson:"_id,omitempty" json:"_id,omitempty"`
	Name      string             `bson:"name" json:"name"`
	Age       int                `bson:"age" json:"age"`
	CreatedAt time.Time          `bson:"created_at" json:"created_at"`
}

var (
	mongoDBURL   = "mongodb://localhost:27017" // Ganti dengan URL MongoDB Anda
	mongoDBName  = "Eksplor"                   // Ganti dengan nama database Anda
	mongoTimeout = 10 * time.Second
)

// MgoConn adalah fungsi untuk menghubungkan ke MongoDB dan mengembalikan klien MongoDB.
func MgoConn() (*mongo.Client, error) {
	// Koneksi ke MongoDB
	client, err := mongo.NewClient(options.Client().ApplyURI(mongoDBURL))
	if err != nil {
		return nil, err
	}

	ctx, cancel := context.WithTimeout(context.Background(), mongoTimeout)
	defer cancel()

	err = client.Connect(ctx)
	if err != nil {
		return nil, err
	}

	return client, nil
}

// MgoCollection adalah fungsi untuk mendapatkan koleksi (collection) dari database.
func MgoCollection(coll string, client *mongo.Client) *mongo.Collection {
	return client.Database(mongoDBName).Collection(coll)
}
