class CreateSprockets < ActiveRecord::Migration
  def change
    create_table :sprockets do |t|
      t.string :model
      t.float :width
      t.float :height
      t.float :weight

      t.timestamps
    end
  end
end
