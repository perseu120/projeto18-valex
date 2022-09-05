import { TransactionTypes, Card, CardInsertData, insert, update } from './../repositories/cardRepository';
import { findByTypeAndEmployeeId } from "../repositories/cardRepository";
import { findByApiKey } from "../repositories/companyRepository";
import { findById } from "../repositories/employeeRepository";
import  findByIdCard  from './../repositories/cardRepository';
import { faker } from '@faker-js/faker';
import dayjs from 'dayjs';
import Cryptr from "cryptr";
import bcrypt from "bcrypt";
import { insertRecharge } from '../repositories/rechargeRepository';

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

export async function verifyCardExistent(id){
    const card = findByIdCard(id)
    
    if(!card){
        throw {code: "NotFound"}
    }

    return card;
}

export async function verifyValidateDateCard(expirationDate){
    const dateDifference = dayjs(expirationDate).diff(dayjs().format('MM/YY'),'month', true);

    if (dateDifference < 0) {
        throw  { code: 'Expired'}
    }
    
    return false;
}

function verifyIfUnlocked(isBlocked: boolean) {
    if (!isBlocked) {
      throw { 
        code: 'Conflict'
      }
    }
}
function verifyIfBlocked(isBlocked: boolean) {
    if (isBlocked) {
      throw { 
        code: 'Conflict'
      }
    }
}

function authenticatePassword(password: string, encryptedPassword: string) {
    const comparePassword = bcrypt.compareSync(password, encryptedPassword);
    if(!comparePassword){
      throw { code: 'Unauthorized' }
    }
}

export async function  unlockCardService(id: number, password: string){
    
    const card = await verifyCardExistent(id);
    
    await verifyValidateDateCard(card.expirationDate);
   
    verifyIfUnlocked(card.isBlocked);
    
    authenticatePassword(password, card.password);
    
    await update(id, {isBlocked: false});
}

export async function  blockCardService(id: number, password: string){
    
    const card = await verifyCardExistent(id);
    
    await verifyValidateDateCard(card.expirationDate);
   
    verifyIfBlocked(card.isBlocked);
    
    authenticatePassword(password, card.password);
    
    await update(id, {isBlocked: true});
}

function encryptPassword(password: string) {
    const encryptedPassword = bcrypt.hashSync(password, 10);
    return encryptedPassword;
}

function verifyCVC(cvc: string, encryptedCVC: string) {
    
    const decryptedCVC: string = cryptr.decrypt(encryptedCVC);

    if (!(cvc === decryptedCVC)) {
      throw  { code: 'BadRequest' }
    }
    return false;
}

export async function activateCardService(id: number, cvc: string, password: string ){
  
    const card = await verifyCardExistent(id);
  
    await verifyValidateDateCard(card.expirationDate);
  
    if (card.password) {
      throw { 
        code: 'Conflict'
      }
    }
  
    verifyCVC(cvc, card.securityCode);
  
    const encryptedPassword = encryptPassword(password);
  
    await update(id, {password: encryptedPassword});

}

function verifyCardActive(password){

    if (!password) {
        throw { 
          code: 'BadRequest'
        }
    }
}

export async function rechargeService(id: number, amount: number, apiKey: string){

    await verifyApiKey(apiKey);
    
    const card = await verifyCardExistent(id);
    
    verifyCardActive(card.password);
    
    await verifyValidateDateCard(card.expirationDate);

    await insertRecharge({cardId: card.id, amount})
}