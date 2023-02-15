Rails.application.routes.draw do
  root 'levels#menu'
  get '/levels', to: 'levels#levels'
  get '/level1', to: 'levels#level1'

  get '/update_level', to: 'levels#update_level'
  post '/run_program', to: 'levels#run_program'

end
