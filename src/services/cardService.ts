import { TransactionTypes, Card, CardInsertData, insert } from './../repositories/cardRepository';
import { findByTypeAndEmployeeId } from "../repositories/cardRepository";
import { findByApiKey } from "../repositories/companyRepository";
import { findById } from "../repositories/employeeRepository";
import { faker } from '@faker-js/faker';
import dayjs from 'dayjs';
import Cryptr from "cryptr";

const cryptr = new Cryptr('myTotallySecretKey');


export async function verifyApiKey(apiKey: string ){


    const companyApiKey = await findByApiKey(apiKey);

    if(!companyApiKey){
        throw { code:"NotFound" }
    }

}

export async function verifyEmployee(employeeId: number){

    const employee = await findById(employeeId);

    if(!employee){
        throw { code:"NotFound" }
    }

    return employee;
}

export async function verifyEmployeeAndType(type: TransactionTypes, employeeId: number){

    const typeCard = await findByTypeAndEmployeeId(type, employeeId);
    console.log(typeCard)
    if(typeCard){
        throw { code:"Conflict" }
    }

}

function factoryName(name:string[]){
    let fullName : string = "";

    for(let i =0; i< name.length; i++){
        
        if(i === 0 || i === name.length-1){
            fullName+= name[i];
        }
        else if(name[i].length >=3){
            fullName+=` ${name[i][0]} `
        }
    }

    return fullName;
}

export async function creatCardCard(apiKey: string, type: TransactionTypes, employeeId: number) {

    await verifyEmployeeAndType(type, employeeId);

    await verifyApiKey(apiKey);

    const employee = await verifyEmployee(employeeId);

    const cardNumber = faker.finance.creditCardNumber('################');
    
    const cardCVV :string = faker.finance.creditCardCVV();
    const encryptedCVV = cryptr.encrypt(cardCVV);
    // cryptr.decrypt(encryptedString); para desencriptografa

    const dataExpirion = dayjs().add(5, 'year').format("MM/YY");

    const fullName = employee.fullName;
    
    const cardholderName = factoryName(fullName.split(" "))

    const Card:CardInsertData = {

        employeeId: employeeId,
        number: cardNumber,
        cardholderName: cardholderName,
        securityCode: encryptedCVV,
        expirationDate: dataExpirion,
        isVirtual: false,
        isBlocked: true,
        type: type

    }

    await insert(Card);

}
