from rest_framework import serializers
from .models import Cake, Category


class CategorySerializer(serializers.ModelSerializer):

    class Meta:
        model = Category
        fields = ["id", "name"]

    def validate_name(self, value):
        value = value.strip()

        if len(value) < 2:
            raise serializers.ValidationError(
                "Category name must be at least 2 characters."
            )

        queryset = Category.objects.filter(
            name__iexact=value
        )

        if self.instance:
            queryset = queryset.exclude(
                pk=self.instance.pk
            )

        if queryset.exists():
            raise serializers.ValidationError(
                "Category already exists."
            )

        return value


class CakeSerializer(serializers.ModelSerializer):

    category_name = serializers.CharField(
        source="category.name",
        read_only=True
    )

    class Meta:
        model = Cake

        fields = [
            "id",
            "category",
            "category_name",
            "name",
            "description",
            "price",
            "weight",
            "image",
            "status",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "created_at",
            "updated_at",
        ]

    def validate_name(self, value):
        value = value.strip()

        if len(value) < 3:
            raise serializers.ValidationError(
                "Cake name must be at least 3 characters."
            )

        return value

    def validate_price(self, value):
        if value <= 0:
            raise serializers.ValidationError(
                "Price must be greater than zero."
            )

        return value

    def validate_weight(self, value):
        value = value.strip()

        if not value:
            raise serializers.ValidationError(
                "Weight is required."
            )

        return value

    def validate_description(self, value):
        value = value.strip()

        if len(value) < 10:
            raise serializers.ValidationError(
                "Description is too short."
            )

        return value

    def validate_image(self, image):

        if image.size > 2 * 1024 * 1024:
            raise serializers.ValidationError(
                "Image size should be less than 2 MB."
            )

        return image