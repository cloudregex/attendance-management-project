import user from '../model/user.model'

export const createUserService =(data)=>{
return user.create(data);
}