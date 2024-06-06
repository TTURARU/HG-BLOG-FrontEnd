export default interface SignUpRequestDTO {
    email: string;
    password: string;
    nickname: string;
    telNumber: string;
    address: string;
    addressDetail: string | null;
    agreedPersonal: boolean;
}