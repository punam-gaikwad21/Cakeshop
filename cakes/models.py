from django.db import models

# Create your models here.


class Category(models.Model):

    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name






class Cake(models.Model):

    STATUS = (

        ("available", "Available"),

        ("out_of_stock", "Out Of Stock"),

    )


    category = models.ForeignKey(

        Category,

        on_delete=models.CASCADE,

        related_name="cakes"

    )


    name = models.CharField(max_length=200)

    description = models.TextField()

    price = models.DecimalField(

        max_digits=8,

        decimal_places=2

    )

    weight = models.CharField(max_length=50)

    image = models.ImageField(

        upload_to="cakes/"

    )

    status = models.CharField(

        max_length=20,

        choices=STATUS,

        default="available"

    )

    created_at = models.DateTimeField(

        auto_now_add=True

    )

    updated_at = models.DateTimeField(

        auto_now=True

    )

    class Meta:

        ordering = ["-created_at"]

    def __str__(self):

        return self.name