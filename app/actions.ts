"use server"

import prisma from "@/lib/prisma";
import type { Category } from "@prisma/client";

export async function checkAndAddAssociation(email: string, name: string) {
    if (!email) return
    try {
        const existingAssociation = await prisma.association.findUnique({
            where: {
                email
            }
        })
        if (!existingAssociation && name) {
            await prisma.association.create({
                data: {
                    email, name
                }
            })
        }

    } catch (error) {
        console.error(error)
    }
}

export async function getAssociation(email : string) {
    if (!email) return 
    try {
        const existingAssociation = await prisma.association.findUnique({
            where: {
                email
            }
        })
        return existingAssociation
    } catch (error) {
        console.error(error)
    }
}

export async function createCategory(name: string , email: string, description : string) {
    if (!name) return
    try {
        const association = await getAssociation(email) ;
        if (!association) {
             throw new Error("Association not found with this email") ;
        }
        await prisma.category.create({
            data: {
                name,               
                description : description || "",
                associationId : association.id
            }
        })
    } catch (error) {
        console.error(error);
        throw new Error("Failed to create category");   
    }
}

export async function updateCategory(id: string, email: string, name: string , description : string) {
    if (!id || !email || !name) {
        throw new Error("ID, email and name are required to update a category") ;
    }
    try {
        const association = await getAssociation(email) ;
        if (!association) {
            throw new Error("Association not found with this email") ;
        }
        await prisma.category.update({
            where: { 
                id : id ,
                associationId : association.id
            },
            data: {
                name,
                description : description || "",
                associationId : association.id
            }
        })
    } catch (error) {
        console.error(error);
        throw new Error("Failed to update category");
    }
}

export async function deleteCategory(id: string, email: string) {
    if (!id || !email) {
        throw new Error("ID and email are required to delete a category") ;
    }
    try {
        const association = await getAssociation(email) ;
        if (!association) {
            throw new Error("Association not found with this email") ;
        }
        await prisma.category.delete({
            where: {
                id : id ,
                associationId : association.id
            }
        })
    } catch (error) {
        console.error(error)
        throw new Error("Failed to delete category");
    }
}

export async function getAllCategories(email: string): Promise<Category[] | undefined> {
    if (!email) {
        throw new Error("Email is required to get categories");
    }
    try {
        const association = await getAssociation(email);
        if (!association) {
            throw new Error("Association not found with this email");
        }
        const categories = await prisma.category.findMany({
            where: {
                associationId: association.id
            }
        });
        return categories;
    } catch (error) {
        console.error(error);
        throw new Error("Failed to get categories");
    }
}