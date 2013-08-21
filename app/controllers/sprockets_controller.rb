class SprocketsController < ApplicationController
  before_filter :load_sprocket, only: [:edit, :update]
  before_filter :new_sprocket_from_params, only: [:new, :create]

  def index
    @sprockets = Sprocket.scoped
  end

  def new
  end

  def create
    if @sprocket.save
      render json: {
          action: 'append',
          selector: '#sprockets',
          dismiss: true,
          html: render_to_string(partial: 'sprocket', locals: {sprocket: @sprocket})
      }
    else
      render json: {
          action: 'replace',
          html: render_to_string(partial: 'form'),
          alert: 'Could not create Sprocket'
      }
    end
  end

  def edit
  end

  def update
    if @sprocket.update_attributes(params[:sprocket])
      render json: {
          action: 'replace',
          selector: "#sprocket_#{@sprocket.id}",
          dismiss: true,
          html: render_to_string(partial: 'sprocket', locals: {sprocket: @sprocket})
      }
    else
      render json: {
          action: 'replace',
          animate: true,
          html: render_to_string(partial: 'form'),
          alert: 'Could not save Sprocket'
      }
    end
  end

  protected

  def load_sprocket
    @sprocket = Sprocket.find(params[:id])
  end

  def new_sprocket_from_params
    @sprocket = Sprocket.new params[:sprocket]
  end
end
