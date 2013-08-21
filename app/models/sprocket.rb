class Sprocket < ActiveRecord::Base
  attr_accessible :height, :model, :weight, :width

  validates_presence_of :model

  validates_numericality_of :width, :height, :weight
end
