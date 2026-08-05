import { PrismaClient} from '@prisma/client'
const prisma = new PrismaClient()

async function main(){
    await prisma.user.createMany({
        data: [
            {
                  
            email: "flow@flow.test",           
            first_name : "andji",
            last_name : "test",
            promo_id: String,
            role:  "SUPER_ADMIN",
            function : "GESTION_ACTIVITES",
            status : "STUDENT"
            poste_id        String?
            gender:"MALE"
            },
            {}
        ], 
        skipDuplicates : true,
    })
    await prisma.member.createMany({
        data : [
            {}
        ]
    })
}

main()

    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async()=>{
        await prisma.$disconnect()
    })