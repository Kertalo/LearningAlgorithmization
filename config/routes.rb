Rails.application.routes.draw do
  root 'menus#index'

  get '/update_level', to: 'levels#update_level'
  post '/run_program', to: 'levels#run_program'

  get '/run_line', to: 'levels#run_line'

  resources :levels
end
