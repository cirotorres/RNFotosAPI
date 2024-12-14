import axios, { AxiosInstance } from 'axios';

class ApiService {
    private api: AxiosInstance;

    constructor(baseURL: string, token: string) {
        // Configura o Axios com URL base e autenticação
        this.api = axios.create({
            baseURL,
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
    }

    // Método para buscar imagens
    async fetchImage(id: string): Promise<string> {
        try {
            const response = await this.api.get(`/photos/view/${id}`, {
                responseType: 'arraybuffer', // Recebe os dados como bytes
            });

            // Converte os bytes para Base64
            return `data:image/jpeg;base64,${Buffer.from(response.data, 'binary').toString('base64')}`;
        } catch (error) {
            console.error('Erro ao buscar a imagem:', error);
            throw new Error('Erro ao carregar a imagem.');
        }
    }

    // Outros métodos como POST, DELETE podem ser adicionados aqui
}
export default ApiService;