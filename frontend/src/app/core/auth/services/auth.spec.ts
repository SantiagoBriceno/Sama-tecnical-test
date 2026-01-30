import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { environment } from '../../../../environments/environment.development';
import { LoginUser, RegisterUser } from '../../user/models/user.model';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  const apiUrl = `${environment.apiUrl}/auth`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService],
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debería crearse el servicio', () => {
    expect(service).toBeTruthy();
  });

  it('debería realizar el login y retornar el token y username', () => {

    // Creamos un mock de usuario y respuesta
    const mockUser: LoginUser = { username: 'unuser', password: '123' };
    const mockResponse = { accessToken: 'abc-123', username: 'testuser' };

    // Llamamos al método login
    service.login(mockUser).subscribe((res) => {

      // Esperamos que la respuesta sea igual al mockResponse
      expect(res).toEqual(mockResponse);
    });

      // Esperamos una petición HTTP
    const req = httpMock.expectOne(`${apiUrl}/login`);

    // Verificamos que la petición sea POST y que el cuerpo sea el usuario mockeado
    expect(req.request.method).toBe('POST');

    // Verificamos que el cuerpo de la petición sea el usuario mockeado
    expect(req.request.body).toEqual(mockUser);
    
    // Simula la respuesta del servidor
    req.flush(mockResponse);
  });

  it('debería enviar una petición POST para registrar un usuario', () => {
    const newUser: RegisterUser = { username: 'new', password: '123', confirmPassword: '123' };

    service.register(newUser).subscribe();

    const req = httpMock.expectOne(`${apiUrl}/register`);
    expect(req.request.method).toBe('POST');
    req.flush({ status: 'success' });
  });
  it('debería obtener el token de localStorage', () => {
    const mockToken = 'my-fake-token';
    
    // Espiamos el localStorage
    const getItemSpy = vi.spyOn(Storage.prototype, 'getItem').mockReturnValue(mockToken);

    const token = service.getToken();

    expect(getItemSpy).toHaveBeenCalledWith('token');
    expect(token).toBe(mockToken);

    getItemSpy.mockRestore(); // Limpiamos el espía
  });
});