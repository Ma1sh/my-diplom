<template>
  <div class="auth-page">
    <div class="auth-container">
      <div class="auth-box">
        <div class="auth-header">
          <div class="logo">
            <div class="logo-icon">
              <span class="logo-text">IT</span>
            </div>
            <span class="logo-title">IT Альянс</span>
          </div>
          <h1>Регистрация</h1>
          <p>Создайте аккаунт для доступа ко всем возможностям</p>
        </div>

        <form @submit.prevent="handleRegister" class="auth-form">
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Имя *</label>
              <input 
                v-model="formData.first_name"
                @input="validateField('first_name')"
                type="text"
                class="form-control"
                :class="{ 'is-invalid': validationErrors.first_name }"
                placeholder="Иван"
              >
              <div v-if="validationErrors.first_name" class="invalid-feedback">
                {{ validationErrors.first_name }}
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Фамилия *</label>
              <input 
                v-model="formData.last_name"
                @input="validateField('last_name')"
                type="text"
                class="form-control"
                :class="{ 'is-invalid': validationErrors.last_name }"
                placeholder="Иванов"
              >
              <div v-if="validationErrors.last_name" class="invalid-feedback">
                {{ validationErrors.last_name }}
              </div>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Email *</label>
            <input 
              v-model="formData.email"
              @input="validateField('email')"
              type="email"
              class="form-control"
              :class="{ 'is-invalid': validationErrors.email }"
              placeholder="your@email.com"
            >
            <div v-if="validationErrors.email" class="invalid-feedback">
              {{ validationErrors.email }}
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Телефон</label>
            <input 
              v-model="formData.phone"
              @input="validateField('phone')"
              type="tel"
              class="form-control"
              :class="{ 'is-invalid': validationErrors.phone }"
              placeholder="+7 (900) 123-45-67"
            >
            <div v-if="validationErrors.phone" class="invalid-feedback">
              {{ validationErrors.phone }}
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Пароль *</label>
            <div class="password-input">
              <input 
                v-model="formData.password"
                @input="validateField('password')"
                :type="showPassword ? 'text' : 'password'"
                class="form-control"
                :class="{ 'is-invalid': validationErrors.password }"
                placeholder="Минимум 8 символов"
              >
              <button 
                type="button"
                class="password-toggle"
                @click="showPassword = !showPassword"
              >
                {{ showPassword ? '👁️' : '👁️‍🗨️' }}
              </button>
            </div>
            <div v-if="validationErrors.password" class="invalid-feedback">
              {{ validationErrors.password }}
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Подтверждение пароля *</label>
            <div class="password-input">
              <input 
                v-model="formData.re_password"
                @input="validateField('re_password')"
                :type="showPasswordConfirm ? 'text' : 'password'"
                class="form-control"
                :class="{ 'is-invalid': validationErrors.re_password }"
                placeholder="Повторите пароль"
              >
              <button 
                type="button"
                class="password-toggle"
                @click="showPasswordConfirm = !showPasswordConfirm"
              >
                {{ showPasswordConfirm ? '👁️' : '👁️‍🗨️' }}
              </button>
            </div>
            <div v-if="validationErrors.re_password" class="invalid-feedback">
              {{ validationErrors.re_password }}
            </div>
          </div>

          <button
            type="submit"
            class="btn btn-primary btn-block"
            :disabled="loading || !isFormValid"
          >
            <span v-if="loading">Регистрация...</span>
            <span v-else>Зарегистрироваться</span>
          </button>
        </form>

        <div class="auth-footer">
          <p>Уже есть аккаунт? 
            <router-link to="/login">Войти</router-link>
          </p>
        </div>
      </div>

      <div class="auth-image">
        <div class="image-content">
          <h2>Присоединяйтесь к нам!</h2>
          <p>Зарегистрируйтесь и получите доступ ко всем преимуществам нашего сервиса</p>
          <div class="features-list">
            <div class="feature">
              <span class="feature-icon">✓</span>
              <span>Онлайн заказы</span>
            </div>
            <div class="feature">
              <span class="feature-icon">✓</span>
              <span>Отслеживание статуса</span>
            </div>
            <div class="feature">
              <span class="feature-icon">✓</span>
              <span>История заказов</span>
            </div>
            <div class="feature">
              <span class="feature-icon">✓</span>
              <span>Специальные предложения</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import { useToast } from 'vue-toastification'

const router = useRouter()
const authStore = useAuthStore()
const toast = useToast()

const formData = ref({
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  password: '',
  re_password: ''
})

// Объект для ошибок валидации
const validationErrors = reactive({
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  password: '',
  re_password: ''
})

const loading = ref(false)
const showPassword = ref(false)
const showPasswordConfirm = ref(false)

// Валидация имени
const validateName = (name, field) => {
  if (!name) {
    validationErrors[field] = 'Поле обязательно для заполнения'
    return false
  }
  if (name.length < 2) {
    validationErrors[field] = 'Минимум 2 символа'
    return false
  }
  if (name.length > 30) {
    validationErrors[field] = 'Максимум 30 символов'
    return false
  }
  if (!/^[а-яА-Яa-zA-Z\s-]+$/.test(name)) {
    validationErrors[field] = 'Только буквы, пробелы и дефисы'
    return false
  }
  validationErrors[field] = ''
  return true
}

// Валидация email
const validateEmail = (email) => {
  if (!email) {
    validationErrors.email = 'Email обязателен'
    return false
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    validationErrors.email = 'Введите корректный email'
    return false
  }
  validationErrors.email = ''
  return true
}

// Валидация телефона
const validatePhone = (phone) => {
  if (phone && phone.trim() !== '') {
    const phoneRegex = /^[\+\d\s\(\)-]{10,20}$/
    if (!phoneRegex.test(phone)) {
      validationErrors.phone = 'Введите корректный номер телефона'
      return false
    }
  }
  validationErrors.phone = ''
  return true
}

// Валидация пароля
const validatePassword = (password) => {
  if (!password) {
    validationErrors.password = 'Пароль обязателен'
    return false
  }
  if (password.length < 8) {
    validationErrors.password = 'Пароль должен содержать минимум 8 символов'
    return false
  }
  if (password.length > 128) {
    validationErrors.password = 'Пароль слишком длинный (максимум 128 символов)'
    return false
  }
  
  let hasUpperCase = /[A-Z]/.test(password)
  let hasLowerCase = /[a-z]/.test(password)
  let hasNumbers = /\d/.test(password)
  
  if (!hasUpperCase || !hasLowerCase || !hasNumbers) {
    validationErrors.password = 'Пароль должен содержать заглавные, строчные буквы и цифры'
    return false
  }
  
  validationErrors.password = ''
  return true
}

// Валидация подтверждения пароля
const validateRePassword = () => {
  if (formData.value.password !== formData.value.re_password) {
    validationErrors.re_password = 'Пароли не совпадают'
    return false
  }
  if (!formData.value.re_password) {
    validationErrors.re_password = 'Подтвердите пароль'
    return false
  }
  validationErrors.re_password = ''
  return true
}

// Валидация всей формы
const isFormValid = computed(() => {
  return validateName(formData.value.first_name, 'first_name') &&
         validateName(formData.value.last_name, 'last_name') &&
         validateEmail(formData.value.email) &&
         validatePhone(formData.value.phone) &&
         validatePassword(formData.value.password) &&
         validateRePassword()
})

// Валидация при вводе
const validateField = (field) => {
  switch(field) {
    case 'first_name':
      validateName(formData.value.first_name, 'first_name')
      break
    case 'last_name':
      validateName(formData.value.last_name, 'last_name')
      break
    case 'email':
      validateEmail(formData.value.email)
      break
    case 'phone':
      validatePhone(formData.value.phone)
      break
    case 'password':
      validatePassword(formData.value.password)
      if (formData.value.re_password) validateRePassword()
      break
    case 're_password':
      validateRePassword()
      break
  }
}

const handleRegister = async () => {
  // Сбрасываем ошибки и включаем индикатор загрузки
  validationErrors.value = { email: '', password: '', re_password: '', phone: '' }
  loading.value = true

  try {

    await authStore.register(formData.value)


    await authStore.login({
      email: formData.value.email,
      password: formData.value.password
    })


    toast.success('Регистрация завершена! Добро пожаловать!')
    router.push('/')

  } catch (error) {
    console.error('Ошибка в процессе регистрации/входа:', error)
    const errData = error.response?.data

    if (!errData) {
      toast.error('Ошибка соединения с сервером')
      return
    }

    if (typeof errData === 'string') {
      toast.error(`Ошибка сервера: ${errData}`)
      return
    }


    if (errData.email) validationErrors.value.email = Array.isArray(errData.email) ? errData.email[0] : errData.email
    if (errData.password) validationErrors.value.password = Array.isArray(errData.password) ? errData.password[0] : errData.password
    if (errData.re_password) validationErrors.value.re_password = Array.isArray(errData.re_password) ? errData.re_password[0] : errData.re_password
    if (errData.phone) validationErrors.value.phone = Array.isArray(errData.phone) ? errData.phone[0] : errData.phone


    if (!errData.email && !errData.password && !errData.re_password) {
      toast.error('Аккаунт создан, но не удалось войти автоматически. Войдите вручную.')
      router.push('/login')
    }
  } finally {
    // Выключаем загрузку в любом случае
    loading.value = false
  }
}
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #2b6cb0;
  padding: 40px 20px;
}

.auth-container {
  max-width: 1100px;
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.auth-box {
  padding: 60px 50px;
  max-height: 90vh;
  overflow-y: auto;
}

.auth-header {
  margin-bottom: 30px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 25px;
}

.logo-icon {
  width: 50px;
  height: 50px;
  background: #2b6cb0;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 15px rgba(43, 108, 176, 0.4);
}

.logo-text {
  color: white;
  font-size: 24px;
  font-weight: 700;
}

.logo-title {
  font-size: 22px;
  font-weight: 700;
  color: #1a202c;
}

.auth-header h1 {
  font-size: 32px;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 10px;
}

.auth-header p {
  color: #718096;
  font-size: 16px;
}

.auth-form {
  margin-bottom: 25px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

.form-group {
  margin-bottom: 20px;
}

.form-label {
  display: block;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 8px;
  font-size: 14px;
}

.form-control {
  width: 100%;
  padding: 12px 14px;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  font-size: 14px;
  transition: all 0.3s;
  font-family: inherit;
}

.form-control:focus {
  outline: none;
  border-color: #2b6cb0;
  box-shadow: 0 0 0 3px rgba(43, 108, 176, 0.1);
}

.form-control.is-invalid {
  border-color: #c53030;
}

.invalid-feedback {
  color: #c53030;
  font-size: 12px;
  margin-top: 5px;
}

.password-input {
  position: relative;
}

.password-toggle {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  font-size: 18px;
  padding: 5px;
}

.btn {
  padding: 14px 32px;
  border-radius: 10px;
  font-weight: 600;
  text-decoration: none;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 16px;
  display: inline-block;
  text-align: center;
}

.btn-primary {
  background: #2b6cb0;
  color: white;
  box-shadow: 0 4px 20px rgba(43, 108, 176, 0.3);
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 25px rgba(43, 108, 176, 0.4);
  background: #2c5282;
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-block {
  width: 100%;
}

.auth-footer {
  text-align: center;
  padding-top: 20px;
  border-top: 2px solid #f7fafc;
}

.auth-footer p {
  color: #718096;
}

.auth-footer a {
  color: #2b6cb0;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.3s;
}

.auth-footer a:hover {
  color: #2c5282;
}

.auth-image {
  background: #2b6cb0;
  padding: 60px 50px;
  display: flex;
  align-items: center;
  color: white;
  position: relative;
  overflow: hidden;
}

.auth-image::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="40" fill="rgba(255,255,255,0.05)"/></svg>');
  opacity: 0.2;
}

.image-content {
  position: relative;
  z-index: 1;
}

.image-content h2 {
  font-size: 36px;
  font-weight: 700;
  margin-bottom: 20px;
  line-height: 1.2;
}

.image-content p {
  font-size: 18px;
  line-height: 1.6;
  opacity: 0.95;
  margin-bottom: 40px;
}

.features-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.feature {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 16px;
}

.feature-icon {
  width: 28px;
  height: 28px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
}

@media (max-width: 968px) {
  .auth-container {
    grid-template-columns: 1fr;
  }

  .auth-image {
    display: none;
  }

  .auth-box {
    padding: 40px 30px;
  }

  .form-row {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .auth-box {
    padding: 30px 20px;
  }

  .auth-header h1 {
    font-size: 26px;
  }
}
</style>