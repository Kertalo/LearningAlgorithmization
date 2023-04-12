Rails.application.routes.draw do
  devise_for :users

  devise_scope :user do
    get '/users/sign_out' => 'devise/sessions#destroy'
  end

  get 'persons/profile'
  root 'menus#index'

  #get 'users/sign_out', to: root_path
  get 'persons/profile', as: 'user_root'

  get '/update_level', to: 'levels#update_level'
  post '/run_program', to: 'levels#run_program'

  get '/run_line', to: 'levels#run_line'

  resources :levels
end
