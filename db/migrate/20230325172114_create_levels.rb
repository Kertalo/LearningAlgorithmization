class CreateLevels < ActiveRecord::Migration[7.0]
  def change
    create_table :levels do |t|
      t.integer :level
      t.integer :width
      t.integer :height
      t.integer :position
      t.integer :rotation

      t.timestamps
    end
  end
end
