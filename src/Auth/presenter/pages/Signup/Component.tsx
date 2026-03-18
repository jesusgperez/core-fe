import { Controller, useForm } from "react-hook-form"
import { SignupProps } from "./models"
import { Input, Button } from "../../../../common/presenter/components"
import { ISignupEntity, DefaultSignupEntity } from "../../../domain/models"
import { yupResolver } from "@hookform/resolvers/yup"
import { signupSchemeValidator } from "../../validators"
import { AuthBackgroundLayout } from "../../layouts"
import logo from '../../../../assets/logo.svg'


const Component = ({ onSignup }: SignupProps) => {
  const {
    control,
    handleSubmit,
    formState: {isValid, errors}
  } = useForm<ISignupEntity>({
    resolver: yupResolver(signupSchemeValidator),
    mode: 'onChange',
    defaultValues: DefaultSignupEntity
  })

  return (
    <AuthBackgroundLayout>
      <div className="flex flex-col md:flex-row w-full h-full">
        <form
          onSubmit={handleSubmit(onSignup)}
          className="flex justify-center items-center w-full h-full lg:w-1/2"
        >
          <div 
            className="flex flex-col justify-around items-center rounded-lg shadow-xl w-5/6 h-1/2 bg-white space-y-2 border-2 border-black-700 px-5 md:w-3/4"
          >
            <h1 className="text-3xl font-bold">Regístrate</h1>
            <div className="flex flex-col space-y-4 w-full md:w-3/4">
              <div className="flex flex-col w-full md:flex-row space-y-4 md:space-x-2 md:space-y-0">
                <Controller
                  name="firstName"
                  control={control}
                  rules={{required: true}}
                  render={({field: {onChange, value}}) => (
                    <Input
                      value={value}
                      placeholder="Nombre"
                      setValue={onChange}
                      errors={{
                        hasError: errors.firstName ? true : false,
                        message: errors.firstName?.message || ''
                      }}
                      containerStyles="w-full"
                    />
                  )}
                />

                <Controller
                  name="lastName"
                  control={control}
                  rules={{required: true}}
                  render={({field: {onChange, value}}) => (
                    <Input
                    value={value}
                    placeholder="Apellido"
                    setValue={onChange}
                    errors={{
                      hasError: errors.lastName ? true : false,
                      message: errors.lastName?.message || ''
                    }}
                      containerStyles="w-full"
                    />
                  )}
                />
              </div>

              <Controller
                name="email"
                control={control}
                rules={{required: true}}
                render={({field: {onChange, value}}) => (
                  <Input
                    value={value}
                    placeholder="Correo electrónico"
                    setValue={onChange}
                    errors={{
                      hasError: errors.email ? true : false,
                      message: errors.email?.message || ''
                    }}
                    containerStyles="w-full"
                  />
                )}
              />

              <div className="flex flex-col">
                <p className="text-xs">Contraseña debe tener:</p>
                <ul className="text-2xs">
                  <li>* Al menos 8 caracteres</li>
                  <li>* Al menos una mayúscula</li>
                  <li>* Al menos un número</li>
                  <li>* Al menos un caracter especial</li>
                </ul>
              </div>

              <Controller
                name="password"
                control={control}
                rules={{required: true}}
                render={({field: {onChange, value}}) => (
                  <Input
                    value={value}
                    placeholder="Contraseña"
                    setValue={onChange}
                    errors={{
                      hasError: errors.password ? true : false,
                      message: errors.password?.message || ''
                    }}
                    containerStyles="w-full"
                    type="password"
                  />  
                )}
              />

              <Controller
                name="passwordRepeat"
                control={control}
                rules={{required: true}}
                render={({field: {onChange, value}}) => (
                  <Input
                    value={value}
                    placeholder="Repetir contraseña"
                    setValue={onChange}
                    errors={{
                      hasError: errors.passwordRepeat ? true : false,
                      message: errors.passwordRepeat?.message || ''
                    }}
                    containerStyles="w-full"
                    type="password"
                  />
                )}
              />
            </div>
            <Button
              text="Registrar"
              onClick={handleSubmit(onSignup)}
              customStyles="bg-blue-400"
              enabled={isValid}
            />
          </div>
        </form>
        <div className="flex justify-center items-center hidden w-1/2 h-full lg:block">
          <img
            src={logo}
            alt=""
            className="hover:animate-spin duration-1000"
          />
        </div>
      </div>
    </AuthBackgroundLayout>
  )
}

export default Component
